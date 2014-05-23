var j = require('jquery');
var eventy = require('eventy');

module.exports = UISelect;

function __bind(fn, me) {
  return function(){
    return fn.apply(me, arguments); 
  }
}

function UISelect(el) {
  if (el.__uiSelect__ instanceof UISelect) {
    return el.__uiSelect__;
  }

  var self = eventy(this);

  self.el = el;
  self.el.__uiSelect__ = self;
  self.optionTemplate = j(self.el).find('[data-template=ui-select-option]').get(0);
  self.optionTemplate.removeAttribute('data-template');
  self.optionTemplate.parentNode.removeChild(self.optionTemplate);
  self.onClickDocument = __bind(self.onClickDocument, self);


  j(self.el).on('click', '.select-input', onClickInput);
  j(self.el).on('click', '.option-list .option', onClickOption);

  function onClickInput(clickEvent) {
    self.toggleOpen();
  }

  function onClickOption(clickEvent) {
    var optionElement = clickEvent.currentTarget;

    j(self.el).find('.option-list .option').removeClass('selected');
    j(optionElement).addClass('selected');
    self.setInputDisplay(j(optionElement).find('.text').get(0).textContent);
    self.trigger('change', j(optionElement).attr('data-value'));
  }

  /**
   * Set default value of select
   */
  if (j(self.el).find('.option-list .option.selected').length) {
    self.value = j(self.el).find('.option-list .option.selected').attr('data-value');
  }
}

UISelect.prototype.setInputDisplay = function (text) {
  j(this.el).find('.select-input .input-display').get(0).textContent = text;
}

UISelect.prototype.addOption = function (value, name) {
  var self = this;
  var optionElement = j(self.optionTemplate).clone().get(0);

  optionElement.setAttribute('data-value', value);
  j(optionElement).find('.text').get(0).textContent = name;
  j(self.el).find('.option-list').get(0).appendChild(optionElement);
}

UISelect.prototype.setOptions = function (options) {
  var self = this;

  self.clearOptions();

  for (var i in options) {
    var option = options[i];
    var optionElement = j(self.optionTemplate).clone().get(0);

    optionElement.setAttribute('data-value', option.value);
    optionElement.textContent = option.name;
    j(self.el).find('.option-list').get(0).appendChild(optionElement);
  }
}

UISelect.prototype.clearOptions = function () {
  j(this.el).find('.option-list').get(0).innerHTML = '';
}

UISelect.prototype.getSelect = function () {
  var self = this;

  // none selection
  if (j(self.el).find('.option-list .option.selected').length === 0) {
    return null;
  }

  // one selection
  if (j(self.el).find('.option-list .option.selected').length === 1) {
    var selectedOption = j(self.el).find('.option-list .option.selected').get(0);

    return {name: j(selectedOption).find('.text').get(0).textContent, value: selectedOption.getAttribute('data-value')};
  }

  // multiple selections
}

UISelect.prototype.toggleOpen = function () {
  if (j(this.el).hasClass('open')) {
    this.close();
  } else {
    this.open();
  }
}

UISelect.prototype.open = function () {
  var self = this;

  j(self.el).addClass('open');
  self.trigger('open');

  setTimeout(function () {
    j(document).on('click', self.onClickDocument);
  }, 10);
}

UISelect.prototype.close = function () {
  var self = this;

  j(self.el).removeClass('open');
  self.trigger('close');
  j(document).off('click', self.onClickDocument);
}

UISelect.prototype.onClickDocument = function () {
  this.close();
}


function LightSelect(el) {
  if (el.__ligtSelect__ instanceof LightSelect) {
    return el.__ligtSelect__;
  }

  var thisLightSelect = eventy(this);

  this.classes = {
    open: 'open'
  }

  this.el = el;
  this.el.__ligtSelect__ = this;
  j(this.el).addClass('inited');
  j(this.el).on('click', '.head', onClickHead);
  j(this.el).on('click', '.options .option', onClickOption);
  this.onClickDocument = __bind(this.onClickDocument, this);

  if (j(this.el).find('.options .option.selected').length) {
    this.value = j(this.el).find('.options .option.selected').attr('data-value');
  }

  function onClickHead(clickEvent) {
    thisLightSelect.toggleOpen();
  }

  function onClickOption(clickEvent) {
    thisLightSelect.selectOption(clickEvent.currentTarget);
  }
}

LightSelect.prototype.value = '';

LightSelect.prototype.getSelectedOption = function () {
  return j(this.el).find('.options .option.selected').get(0) || null;
}

LightSelect.prototype.getValue = function () {
  var selectedOption = this.getSelectedOption();

  if (selectedOption === null) {
    return null;
  }

  return selectedOption.getAttribute('data-value');
}

LightSelect.prototype.selectOption = function (option) {
  var value = j(option).attr('data-value');

  j(this.el).find('.options .option').removeClass('selected');
  j(option).addClass('selected');
  j(this.el).find('.display').html(j(option).html());
  this.changeHiddenInputValue(value);
  this.close();
  this.value = value;
  this.trigger('change', value);
}

LightSelect.prototype.changeHiddenInputValue = function (value) {
  if (j(this.el).find('input').length) {
    j(this.el).find('input').val(value);
  }
}

LightSelect.prototype.toggleOpen = function () {
  if (j(this.el).hasClass(this.classes.open)) {
    this.close();
  } else {
    this.open();
  }
}

LightSelect.prototype.onClickDocument = function (clickEvent) {
  this.close();
}

LightSelect.prototype.open = function () {
  var thisLightSelect = this;

  j(this.el).addClass(this.classes.open);
  this.trigger('open');

  setTimeout(function () {
    j(document).on('click', thisLightSelect.onClickDocument);
  }, 10);
}

LightSelect.prototype.close = function () {
  j(this.el).removeClass(this.classes.open);
  j(document).off('click', this.onClickDocument);
  this.trigger('close');
}
