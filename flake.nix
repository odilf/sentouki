{
  description = "Description for the project";

  inputs = {
    flake-parts.url = "github:hercules-ci/flake-parts";
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
  };

  outputs =
    inputs@{ flake-parts, ... }:
    flake-parts.lib.mkFlake { inherit inputs; } {
      systems = [
        "x86_64-linux"
        "aarch64-linux"
        "aarch64-darwin"
        "x86_64-darwin"
      ];
      perSystem =
        {
          pkgs,
          ...
        }:
        {
          devShells.default = pkgs.mkShell {
            packages = [
              pkgs.pnpm_10
              pkgs.nodejs_24
            ];
          };

          packages = {
            default = pkgs.callPackage ./package.nix { };
            register = pkgs.callPackage ./register.nix { };
          };
        };

      flake = {
        nixosModules.default = import ./module.nix;
      };
    };
}
