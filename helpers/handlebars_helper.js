const moment = require('moment');

module.exports = {
  truncate(str, len) {
    if (str.length > len && str.length > 0) {
      let newStr = `${str} `;
      newStr = str.substr(0, len);
      newStr = str.substr(0, newStr.lastIndexOf(' '));
      newStr = newStr.length > 0 ? newStr : str.substr(0, len);
      return `${newStr}...`;
    }
    return str;
  },
  stripTags(input) {
    return input.replace(/<(?:.|\n)*?>/gm, '');
  },
  formatDate(date, format) {
    return moment(date).format(format);
  },
  select(selected, options) {
    return options
      .fn(this)
      .replace(new RegExp(`value="${selected}"`), '$&selected="selected"')
      .replace(new RegExp(`>${selected} </option>`), 'selected="selected"$&');
  },
  editIcon(storyUser, loggedUser, storyId, floating = true) {
    if (storyUser === loggedUser) {
      // The floating var controls the class btn-floating in the stories index template
      if (floating) {
        return `<a href="/stories/edit/${storyId}" class="btn-floating halfway-fab red"><i class="fa fa-pencil"></i></a>`;
      }
      return `<a href="/stories/edit/${storyId}"><i class="fa fa-pencil"></i></a>`;
    }
    return '';
  },
};
