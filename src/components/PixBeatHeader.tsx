import { Bell, ChevronDown } from "lucide-react";

type PixBeatHeaderProps = {
  username?: string;
  showNotifications?: boolean;
  avatarUrl?: string;
};

export const PixBeatHeader = ({
  username = "Nghia",
  showNotifications = true,
  avatarUrl,
}: PixBeatHeaderProps) => {
  return (
    <header className="pixbeat-header panel-reveal panel-delay-1">
      <div className="pixbeat-header-grid-bg" aria-hidden="true" />

      <div className="pixbeat-header-inner">
        <div className="pixbeat-brand-block">
          <p className="pixbeat-brand-kicker">LIVE SIGNAL</p>
          <h1 className="pixbeat-logo" aria-label="PixBeat">
            PixBeat
          </h1>
        </div>

        <div className="pixbeat-profile-wrap">
          <div className="pixbeat-profile-rail">
            {showNotifications ? (
              <>
                <button
                  type="button"
                  aria-label="Notifications"
                  className="pixbeat-icon-btn"
                >
                  <Bell className="h-4 w-4" />
                </button>
                <span className="pixbeat-profile-divider" aria-hidden="true" />
              </>
            ) : null}

            <button
              type="button"
              className="pixbeat-user-chip"
              aria-label="Open profile menu"
            >
              <span className="pixbeat-avatar-wrap" aria-hidden="true">
                {avatarUrl ? (
                  <img src={avatarUrl} alt="" className="pixbeat-avatar-img" />
                ) : (
                  <span className="pixbeat-avatar-fallback">
                    {username.slice(0, 1).toUpperCase()}
                  </span>
                )}
              </span>

              <span className="pixbeat-username">{username}</span>
              <ChevronDown className="h-4 w-4 text-neon-cyan" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
