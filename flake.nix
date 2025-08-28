{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        packages = {
          default = pkgs.callPackage ./package.nix { };
        };

        devShells.default = pkgs.mkShell {
          buildInputs = [
            pkgs.nodejs_24
            pkgs.pnpm
          ];

          shellHook = ''
            pnpm db:push
            pnpm exec vite-node --script scripts/seedDb.ts
            pnpm i
          '';
        };

        formatter = pkgs.nixfmt-rfc-style;
      }
    )
    // {
      nixosModules.default = import ./module.nix;
    };
}
