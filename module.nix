{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.services.sentouki;
  sentouki-pkg = pkgs.callPackage ./package.nix { };
  sentouki-register-pkg = pkgs.callPackage ./register.nix { };

  # Taken from immich
  commonServiceConfig = {
    Type = "simple";

    # Hardening
    CapabilityBoundingSet = "";
    NoNewPrivileges = true;
    PrivateUsers = true;
    PrivateTmp = true;
    PrivateDevices = true;
    PrivateMounts = true;
    ProtectClock = true;
    ProtectControlGroups = true;
    ProtectHome = true;
    ProtectHostname = true;
    ProtectKernelLogs = true;
    ProtectKernelModules = true;
    ProtectKernelTunables = true;
    RestrictAddressFamilies = [
      "AF_INET"
      "AF_INET6"
      "AF_UNIX"
    ];
    RestrictNamespaces = true;
    RestrictRealtime = true;
    RestrictSUIDSGID = true;
  };
in
{
  options.services.sentouki = {
    root = lib.mkOption {
      description = "The root of the displayed paths.";
      type = lib.types.str;
      example = "/mnt/HARD-DRIVE-WITH-DATA/";
    };

    enable = lib.mkEnableOption "sentouki";
    port = lib.mkOption {
      type = lib.types.int;
      default = 2578;
      description = "Port to listen on";
    };

    host = lib.mkOption {
      type = lib.types.str;
      default = "localhost";
    };

    origin = lib.mkOption {
      type = lib.types.nullOr lib.types.str;
      example = "https://my.site";
      default = null;
    };

    database-url = lib.mkOption {
      description = "The path to the database file.";
      type = lib.types.nullOr lib.types.str;
      default = "file:/var/lib/sentouki/local.db";
    };

    node-package = lib.mkPackageOption pkgs "node" { };
  };

  config = {
    environment.systemPackages = lib.mkIf cfg.enable [
      sentouki-register-pkg
    ];

    systemd.services.sentouki = lib.mkIf cfg.enable {
      description = "Web-based file browser";
      after = [ "network.target" ];
      wantedBy = [ "multi-user.target" ];

      serviceConfig = commonServiceConfig // {
        ExecStart = "${pkgs.nodejs}/bin/node ${sentouki-pkg}/build";
        StateDirectory = "sentouki";
        SyslogIdentifier = "sentouki";
        RuntimeDirectory = "sentouki";
      };

      environment = {
        "SENTOUKI_ROOT" = cfg.root;
        "PORT" = "${toString cfg.port}";
        "HOST" = cfg.host;
        "ORIGIN" = lib.mkIf (cfg.origin != null) cfg.origin;
        "DATABASE_URL" = cfg.database-url;

        "SENTOUKI_FILE" = lib.getExe pkgs.file;
        "SENTOUKI_FD" = lib.getExe pkgs.fd;
      };
    };
  };
}
