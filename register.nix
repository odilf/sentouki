{
  nodejs,
  pnpm_10,
  bash,
  stdenv,
  lib,
}:
stdenv.mkDerivation (finalAttrs: rec {
  pname = "sentouki-register";
  version = "0.1.0";

  src = lib.cleanSource ./.;

  nativeBuildInputs = [
    nodejs
    pnpm_10.configHook
  ];

  pnpmDeps = pnpm_10.fetchDeps {
    inherit (finalAttrs) pname version src;
    hash = "sha256-7pDR2gNSkLpRoPyD1ae/VwH8qwRtBsdMZKK0o84wcaQ=";
    fetcherVersion = 2;
  };

  installPhase = ''
    runHook preInstall

    mkdir -p $out
    cp -r src node_modules package.json $out/

    mkdir -p $out/bin
    echo "\
    #!${bash}/bin/bash
    TEST=true ${nodejs}/bin/node node_modules/vite-node/dist/cli.cjs src/cli/register.ts
    " > $out/bin/${pname}

    chmod ugo+x $out/bin/${pname}

    runHook postInstall
  '';
})
