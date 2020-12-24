const getSettingsContent = (state) => {
  let values = '';
  state.value.forEach((item, index) => {
    values += `
    <label class="settings__item">
      <input name="value-${index}" type="number" min="1" value="${item}" class="settings__value"/>
      <span span class="settings__name">value_${index}</span>
    </label> 
    `;
  });
  return `
  <label class="settings__item">
      <input name="max" type="number" step="${state.step}" value="${state.max}" class="settings__value"/>
      <span class="settings__name">max</span>
  </label>
  <label class="settings__item">
      <input name="min" type="number" step="${state.step}" value="${state.min}" class="settings__value"/>
      <span class="settings__name">min</span>
  </label>
  <label class="settings__item">
      <input name="step" type="number" min="1" value="${state.step}" class="settings__value"/>
      <span class="settings__name">step</span>
  </label> 
  ${values}
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
    <option>multiple</option>
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
  <label class="settings__item">
  <select name="settings">
    <option>true</option>
    <option>false</option>
  </select>
  <span class="settings__name">settings</span>
  </label>
  `;
};
export { getSettingsContent };
