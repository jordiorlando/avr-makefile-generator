$.getJSON('data.json', function(data) {
  var formElement = document.getElementById('options');

  for (var i in data) {
    var input;
    if (data[i].type === 'select') {
      input = document.createElement('select');
      input.classList.add('custom-select');
      input.id = 'input-' + i;
      input.addEventListener('change', function(e) {
        document.getElementById(e.target.id.replace('input-', 'display-')).textContent = e.target.value;
      });
      var option = document.createElement('option');
      option.setAttribute('selected', '');
      option.setAttribute('disabled', '');
      option.textContent = data[i].field;
      input.appendChild(option);

      for (var j in data[i].options) {
        option = document.createElement('option');
        option.setAttribute('value', data[i].options[j][0]);
        if (data[i].options[j][2]) {
          input.firstChild.removeAttribute('selected');
          option.setAttribute('selected', '');
        }
        option.textContent = data[i].options[j][1];
        input.appendChild(option);
      }

    } else if (data[i].type === 'input') {
      input = document.createElement('input');
      input.classList.add('form-control');
      input.setAttribute('type', 'text');
      input.setAttribute('placeholder', data[i].field);
      input.setAttribute('value', data[i].value);
      input.id = 'input-' + i;
      input.addEventListener('input', function(e) {
        document.getElementById(e.target.id.replace('input-', 'display-')).textContent = e.target.value;
      });
    } else if (data[i].type === 'input-group') {
      input = document.createElement('div');
      input.classList.add('input-group');

      var addon = document.createElement('span');
      addon.classList.add('input-group-addon');
      addon.textContent = data[i].addon;
      addon.id = 'input-' + i + '-addon';
      input.appendChild(addon);

      var inputGroup = document.createElement('input');
      inputGroup.classList.add('form-control');
      inputGroup.setAttribute('type', 'text');
      inputGroup.setAttribute('minlength', '2');
      inputGroup.setAttribute('maxlength', '2');
      inputGroup.setAttribute('pattern', '[0-9A-Fa-f]{2}');
      inputGroup.setAttribute('placeholder', data[i].field);
      inputGroup.setAttribute('value', data[i].value);
      inputGroup.setAttribute('aria-describedby', 'input-' + i + '-addon');
      inputGroup.id = 'input-' + i;
      inputGroup.addEventListener('input', function(e) {
        if (/^[0-9A-F]{0,2}$/i.test(e.target.value)) {
          document.getElementById(e.target.id.replace('input-', 'display-')).textContent = e.target.value;
        } else {
          e.target.value = document.getElementById(e.target.id.replace('input-', 'display-')).textContent;
        }
      });
      input.appendChild(inputGroup);
    }

    formElement.appendChild(input);
  }

  document.getElementById('button-save').addEventListener('click', function() {
    saveAs(new Blob([document.getElementById('makefile').textContent], {type: 'text/plain;charset=utf-8'}), 'Makefile');
  });

  $.get('Makefile', function(file) {
    var makefileElement = document.getElementById('makefile');
    var parts = file.split(/({{\w+}})/);

    for (var i in parts) {
      var node;
      if (/({{\w+}})/.test(parts[i])) {
        var option = parts[i].replace(/{|}/g, '');
        node = document.createElement('span');
        node.classList.add('option');
        node.id = 'display-' + option;
        node.textContent = document.getElementById('input-' + option).value;
      } else {
        node = document.createTextNode(parts[i]);
      }
      makefileElement.appendChild(node);
    }
  });
});
