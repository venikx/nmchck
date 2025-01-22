{
  description = "nmchck";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
    gomod2nix = {
      url = "github:nix-community/gomod2nix";
      inputs.nixpkgs.follows = "nixpkgs";
      inputs.flake-utils.follows = "flake-utils";
    };
  };

  outputs = inputs:
    inputs.flake-utils.lib.eachDefaultSystem (system:
      let
        version = builtins.substring 0 8 inputs.self.lastModifiedDate;
        pkgs = import inputs.nixpkgs {
          inherit system;
          overlays = [ inputs.gomod2nix.overlays.default ];
          config.allowUnfree = true;
        };
      in {
        packages = {
          nmchck = pkgs.buildGoApplication {
            inherit version;
            pname = "nmchck";
            src = ./.;
            modules = ./gomod2nix.toml;
          };
          default = inputs.self.packages.${system}.nmchck;
        };

        devShells.default = with pkgs;
          pkgs.mkShell {
            inputsFrom = [ inputs.self.packages.${system}.nmchck ];

            packages = [
              nodePackages.aws-cdk
              awscli2
              #dynamodb-local
              gopls
              gotools
              go-tools
              inputs.gomod2nix.packages.${system}.default
            ];
          };
      });
}
