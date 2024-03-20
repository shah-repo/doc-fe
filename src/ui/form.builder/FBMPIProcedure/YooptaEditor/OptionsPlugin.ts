// CustomMenuPlugin.ts
import { Editor, MenuButton, MenuGroup, Plugin } from '@yoopta/editor';

class CustomMenuPlugin implements Plugin {
  constructor(public editor: Editor) {}

  start() {
    // Create a MenuButton component for each option
    const option1 = (
      <MenuButton
        key="option1"
        onClick={() => console.log('Option 1 clicked')}
        title="Option 1"
      >
        Option 1
      </MenuButton>
    );

    const option2 = (
      <MenuButton
        key="option2"
        onClick={() => console.log('Option 2 clicked')}
        title="Option 2"
      >
        Option 2
      </MenuButton>
    );

    // Create a MenuGroup component to hold the menu options
    const menuGroup = <MenuGroup key="customMenu" title="Custom Menu" buttons={[option1, option2]} />;

    // Add the MenuGroup to the editor's toolbar
    this.editor.ui.add(menuGroup);
  }
}

// Register the plugin
export const useCustomMenuPlugin = (editor: Editor) => {
  return new CustomMenuPlugin(editor);
};