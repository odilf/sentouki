{
  pkgs,
  lib,
}:
pkgs.stdenv.mkDerivation (finalAttrs: rec {
  pname = "sentouki";
  version = "0.1.0";

  src = pkgs.lib.cleanSource ./.;

  buildInputs = [
    pkgs.file
  ];

  nativeBuildInputs = [
    pkgs.nodejs
    pkgs.pnpm.configHook
    pkgs.vips
  ];

  pnpmDeps = pkgs.pnpm.fetchDeps {
    inherit (finalAttrs) pname version src;
    hash = "sha256-ktHwRwQ5x3CyIlWSG6ea+fLUjI4iIdyV6H0XEDIWEs8=";
  };

  buildPhase = ''
    runHook preBuild

    pnpm run build

    runHook postBuild
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out
    cp -r build $out/build

    pnpm prune --prod
    cp -r node_modules package.json $out/

    # Slighty bodgy. Perhaps not only slightly.
    mkdir -p $out/src/lib/server/db/
    cp src/lib/server/db/schema.ts $out/src/lib/server/db/schema.ts
    cp drizzle.config.ts $out/

    mkdir -p $out/bin
    echo "\
    #!${pkgs.bash}/bin/bash 
    export PATH=${lib.makeBinPath [ pkgs.file ]}

    ${pkgs.nodejs}/bin/node $out/node_modules/drizzle-kit/bin.cjs push
    ${pkgs.nodejs}/bin/node $out/build
    " > $out/bin/${pname}

    chmod +x $out/bin/${pname}

    runHook postInstall
  '';
})
