{
  nodejs,
  pnpm_10,
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
    pnpm_10.configHook
  ];

  buildInputs = [
    file
  ];

  pnpmDeps = pnpm_10.fetchDeps {
    inherit (finalAttrs) pname version src;
    hash = "sha256-0JZpcB4J5Mx5IpK+RRRqb1ckXL0eQTcZG9Eli7XZtJ8=";
    fetcherVersion = 2;
  };

  installPhase = ''
    runHook preInstall

    mkdir -p $out
    cp -r * $out/

    mkdir -p $out/bin
    echo "\
    #!${bash}/bin/bash
    TEST=true ./node_modules/vite-node/vite-node.mjs src/cli/register.ts
    " > $out/bin/${pname}

    chmod ugo+x $out/bin/${pname}

    runHook postInstall
  '';
})
