{
  pkgs,
}:
pkgs.stdenv.mkDerivation (finalAttrs: rec {
  pname = "sentouki";
  version = "0.1.0";

  src = ../.;

  buildInputs = [
  ];

  nativeBuildInputs = [
    pkgs.nodejs
    pkgs.pnpm_10.configHook
  ];

  pnpmDeps = pkgs.pnpm_10.fetchDeps {
    inherit (finalAttrs) pname version src;
    fetcherVersion = 2;
    hash = "sha256-GreQvegdPPuayb5hj9r7ZoSHO0EdBE798NCc8enxNOM=";
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
    # Clean up broken symlinks left behind by `pnpm prune`
    # https://github.com/pnpm/pnpm/issues/3645
    find node_modules -xtype l -delete

    cp -r node_modules package.json $out/

    # Slighty bodgy. Perhaps not only slightly.
    # mkdir -p $out/src/lib/server/db/
    # cp src/lib/server/db/schema.ts $out/src/lib/server/db/schema.ts
    # cp drizzle.config.ts $out/

    mkdir -p $out/bin
    echo "\
    #!${pkgs.bash}/bin/bash

    ${pkgs.nodejs}/bin/node $out/node_modules/drizzle-kit/bin.cjs push
    ${pkgs.nodejs}/bin/node $out/build
    " > $out/bin/${pname}

    chmod ugo+x $out/bin/${pname}

    runHook postInstall
  '';
})
