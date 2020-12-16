const getSettingsContent = (options) => `
  <label class="settings__item">
      <input name="max" type="number" step="${options.step}" value="${options.max}" class="settings__value"/>
      <span class="settings__name">max</span>
  </label>
  <label class="settings__item">
      <input name="min" type="number" step="${options.step}" value="${options.min}" class="settings__value"/>
      <span class="settings__name">min</span>
  </label>
  <label class="settings__item">
      <input name="step" type="number" min="1" value="${options.step}" class="settings__value"/>
      <span class="settings__name">step</span>
  </label>
  <label class="settings__item">
    <input name="from" type="number" value="${options.value[0]}" class="settings__value"/>
    <span class="settings__name">from</span>
  </label>
  <label class="settings__item">
    <input name="to" type="number" value="${options.value[1] ?? 0}" class="settings__value"/>
    <span class="settings__name">to</span>
  </label>

  <label class="settings__item">
  <select name="position">
    <option>horizontal</option>
    <option>vertical</option>
  </select>
  <span class="settings__name">position</span>
  </label>
  <label class="settings__item">
  <select name="type">
    <option>single</option>
    <option>range</option>
  </select>
  <span class="settings__name">type</span>
  </label>
  <label class="settings__item">
  <select name="scale">
    <option>true</option>
    <option>false</option>
  </select>
  <span class="settings__name">scale</span>
  </label>
  <label class="settings__item">
  <select name="tooltip">
    <option>true</option>
    <option>false</option>
  </select>
  <span class="settings__name">tooltip</span>
  </label>
  <label class="settings__item">
  <select name="bar">
    <option>true</option>
    <option>false</option>
  </select>
  <span class="settings__name">bar</span>
  </label>
  `;
export { getSettingsContent };
