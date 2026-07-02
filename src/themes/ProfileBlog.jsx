import { THEMES } from '../constants/defaultProfile';
import ClassicTheme from './ClassicTheme';
import ModernTheme from './ModernTheme';

export default function ProfileBlog({ profile, theme }) {
  if (theme === THEMES.MODERN) {
    return <ModernTheme profile={profile} />;
  }
  return <ClassicTheme profile={profile} />;
}
