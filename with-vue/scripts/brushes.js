const DefaultBrush = {
  inject: ['draw'],
  render: function(c) {
    return c('div', ['hi'])
  },
};

const RainbowBrush = {
  inject: ['draw'],
  render: function(c) {
    return c('div', ['Hello'])
  },
};