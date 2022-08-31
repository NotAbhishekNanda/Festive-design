var design = anime({
  targets: '#rayganeshjee polygon',
  easing: 'easeInBounce',
  duration: 3500,
  rotate: function() { return anime.random(0, 360); },
  direction: 'alternate',
  loop: true
});

var design = anime({
  targets: '#borderbox',
 strokeDashoffset: [anime.setDashoffset, 0],
  easing: 'easeInOutSine',
  duration: 1500,
  delay: function(el, i) { return i * 250 },
  direction: 'alternate',
  loop: true
});
