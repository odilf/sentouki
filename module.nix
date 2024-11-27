{
  config,
  lib,
  pkgs,
  ...
}:
let
  cfg = config.services.sentouki;
  sentouki-pkg = pkgs.callPackage ./default.nix { };

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

    basePath = lib.mkOption {
      description = "The root of the displayed paths.";
      type = lib.types.str;
      example = "/mnt/HARD-DRIVE-WITH-DATA/";
    };

    dbFile = lib.mkOption {
      description = "The path to the database file.";
      type = lib.types.nullOr lib.types.str;
      default = "/var/lib/sentouki/main.db";
    };

    node-package = lib.mkPackageOption pkgs "node" { };
  };

  config.systemd.services.sentouki = lib.mkIf cfg.enable {
    description = "Web-based file browser";
    after = [ "network.target" ];
    wantedBy = [ "multi-user.target" ];

    serviceConfig = commonServiceConfig // {
      ExecStart = "${sentouki-pkg}/bin/sentouki";
      StateDirectory = "sentouki";
      SyslogIdentifier = "sentouki";
      RuntimeDirectory = "sentouki";
    };

    environment = {
      "PORT" = "${toString cfg.port}";
      "HOST" = cfg.host;
      "ORIGIN" = lib.mkIf (cfg.origin != null) cfg.origin;
      "BASE_PATH" = cfg.basePath;
      "DB_FILE" = lib.mkIf (cfg.dbFile != null) cfg.dbFile;
    };
  };
}

