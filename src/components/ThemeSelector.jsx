import { THEMES } from '../constants/defaultProfile';

const THEME_OPTIONS = [
  {
    id: THEMES.CLASSIC,
    name: 'Classic Professional',
    description: 'Clean white layout with navy accents — ideal for corporate roles.',
    preview: 'classic',
  },
  {
    id: THEMES.MODERN,
    name: 'Modern Gradient',
    description: 'Bold dark theme with vibrant gradients — great for creative profiles.',
    preview: 'modern',
  },
];

export default function ThemeSelector({ selectedTheme, onSelect, onSave, saving, hasChanges }) {
  const isDisabled = saving || !hasChanges;

  return (
    <div className="theme-selector card">
      <h3>Choose Your Portfolio Theme</h3>
      <p className="muted">Select a theme for your public candidate profile. It will be saved for your profile.</p>

      <div className="theme-grid">
        {THEME_OPTIONS.map((theme) => (
          <button
            key={theme.id}
            type="button"
            className={`theme-card theme-card--${theme.preview} ${selectedTheme === theme.id ? 'selected' : ''}`}
            onClick={() => onSelect(theme.id)}
          >
            <div className="theme-card__preview">
              <div className="theme-card__bar" />
              <div className="theme-card__line" />
              <div className="theme-card__line short" />
            </div>
            <strong>{theme.name}</strong>
            <span>{theme.description}</span>
            {selectedTheme === theme.id && <em className="theme-badge">Selected</em>}
          </button>
        ))}
      </div>

      <button
        type="button"
        className={`btn btn-primary ${!hasChanges ? 'btn-saved' : ''}`}
        onClick={onSave}
        disabled={isDisabled}
      >
        {saving ? 'Saving...' : hasChanges ? 'Save Theme' : 'Theme Saved'}
      </button>
    </div>
  );
}
