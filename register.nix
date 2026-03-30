{
  nodejs,
  pnpm_10,
  fetchPnpmDeps,
  pnpmConfigHook,
  bash,
  stdenv,
  file,
  lib,
}:
stdenv.mkDerivation (finalAttrs: rec {
  pname = "sentouki-register";
  version = "0.1.0";

  src = lib.cleanSource ./.;

  nativeBuildInputs = [
    nodejs
    pnpmConfigHook
    pnpm_10
  ];

  buildInputs = [
    file
  ];

  pnpmDeps = fetchPnpmDeps {
    inherit (finalAttrs) pname version src;
    pnpm = pnpm_10;
    hash = "sha256-6CSKAHtXKf5j93vSO9wv/BX+38urvRRtxz8VLD+hFH0=";
    fetcherVersion = 3;
  };

  installPhase = ''
    runHook preInstall

    mkdir -p $out
    cp -r * $out/

    mkdir -p $out/bin
    echo "\
    #!${bash}/bin/bash
    TEST=true $out/node_modules/vite-node/dist/cli.mjs src/cli/register.ts
    " > $out/bin/${pname}

    chmod ugo+x $out/bin/${pname}

    runHook postInstall
  '';
})
