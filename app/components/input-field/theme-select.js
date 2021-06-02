import Component from '@glimmer/component';
import { action } from '@ember/object';
import { inject as service } from '@ember/service';
import { tracked } from '@glimmer/tracking';

export default class InputFieldThemeSelectComponent extends Component {
  @service store;

  @tracked themes = [];


  @action
  async onThemeSelectRender(selectedTheme) {
    const themes = await this.store.findAll('theme');
    let newThemes = [];
    themes.forEach(theme => {
      //make sure to add actual selected themes when BE code is working
      let checked = selectedTheme.filter(a => a === theme.label).length > 0 ? true : false;
      newThemes.push({
        theme: theme,
        checked: checked
      });
    });
    this.themes = newThemes;
  }

  @action
  selectTheme(theme, b) {
    this.args.onSelectTheme(theme, b.target.checked);
  }

  getSelected() {
    return false;
  }
}
