{
  pkgs,

  # https://kit.svelte.dev/docs/adapter-node#environment-variables-port-host-and-socket-path
  port ? 6942,
  # Can't be just `host` because it conflicts with package (and I prefer to not have to do
  # [this](https://github.com/nixos/nixpkgs/commit/d17f0f9cbca38fabb71624f069cd4c0d6feace92))
  serverHost ? null,
  socketPath ? null,
}:
pkgs.stdenv.mkDerivation (finalAttrs: rec {
  pname = "sentouki";
  version = "0.1.0";

  src = pkgs.lib.cleanSource ./.;

  nativeBuildInputs = [
    pkgs.nodejs
    pkgs.pnpm.configHook
    pkgs.makeWrapper
    pkgs.vips
  ];

  pnpmDeps = pkgs.pnpm.fetchDeps {
    inherit (finalAttrs) pname version src;
    hash = "sha256-e4vuc5veADyqm9hAeI/ZKtrhQPTCyBOVgwzeqhafzyI=";
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

    mkdir -p $out/bin
    echo "
      #!${pkgs.bash}/bin/bash 
      ${pkgs.nodejs}/bin/node $out/build
    " > $out/bin/${pname}

    chmod +x $out/bin/${pname}

    wrapProgram $out/bin/${pname} \
      --set PORT ${builtins.toString port} \
      ${if serverHost != null then "--set HOST ${serverHost}" else ""} \
      ${if socketPath != null then "--set SOCKET_PATH ${socketPath}" else ""} \

    runHook postInstall
  '';
})

