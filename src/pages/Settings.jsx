import PreviewMsgs from "../components/PreviewMsgs";
import ThemesGrid from "../components/ThemesGrid";

const SettingsPage = () => {
  return (
    <div className="min-h-screen container mx-auto px-4  max-w-7xl py-20">
      <div className="space-y-6">
        <div className="flex flex-col gap-1 text-center">
          <h2 className="text-lg font-semibold">Theme</h2>
          <p className="text-sm text-base-content/70">
            Choose a theme for your chat interface
          </p>
        </div>

        <ThemesGrid />

        <PreviewMsgs />
      </div>
    </div>
  );
};
export default SettingsPage;
