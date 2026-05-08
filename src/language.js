'use strict';

const languageConfig = {
  NL: {
    directions: {
      N: 'noord', NE: 'noordoost', E: 'oost', SE: 'zuidoost',
      S: 'zuid', SW: 'zuidwest', W: 'west', NW: 'noordwest'
    },

    text: {
      Head: 'Vertrek',
      Continue: 'Ga rechtdoor',
      Straight: 'Ga rechtdoor',
      Right: 'Sla rechtsaf',
      TurnRight: 'Sla rechtsaf',
      Left: 'Sla linksaf',
      TurnLeft: 'Sla linksaf',
      SlightRight: 'Houd rechts aan',
      KeepRight: 'Houd rechts aan',
      SlightLeft: 'Houd links aan',
      KeepLeft: 'Houd links aan',
      SharpRight: 'Sla scherp rechtsaf',
      SharpLeft: 'Sla scherp linksaf',
      TurnAround: 'Keer om',
      Roundabout: 'Neem de rotonde',
      WaypointReached: 'Tussenpunt bereikt',
      DestinationReached: 'Bestemming bereikt'
    },

    road: 'op',

    fallback: (text) => text
      .replace(/^Turn right onto (.+)$/, 'Sla rechtsaf op $1')
      .replace(/^Turn left onto (.+)$/, 'Sla linksaf op $1')
      .replace(/^Turn right$/, 'Sla rechtsaf')
      .replace(/^Turn left$/, 'Sla linksaf')
      .replace(/^Continue$/, 'Ga rechtdoor')
      .replace(/^Keep right$/, 'Houd rechts aan')
      .replace(/^Keep left$/, 'Houd links aan')
  },

  FR: {
    directions: {
      N: 'nord', NE: 'nord-est', E: 'est', SE: 'sud-est',
      S: 'sud', SW: 'sud-ouest', W: 'ouest', NW: 'nord-ouest'
    },

    text: {
      Head: 'Départ',
      Continue: 'Continuez tout droit',
      Straight: 'Continuez tout droit',
      Right: 'Tournez à droite',
      TurnRight: 'Tournez à droite',
      Left: 'Tournez à gauche',
      TurnLeft: 'Tournez à gauche',
      SlightRight: 'Restez légèrement à droite',
      KeepRight: 'Restez légèrement à droite',
      SlightLeft: 'Restez légèrement à gauche',
      KeepLeft: 'Restez légèrement à gauche',
      SharpRight: 'Tournez fortement à droite',
      SharpLeft: 'Tournez fortement à gauche',
      TurnAround: 'Faites demi-tour',
      Roundabout: 'Prenez le rond-point',
      WaypointReached: 'Point intermédiaire atteint',
      DestinationReached: 'Destination atteinte'
    },

    road: 'sur',

    fallback: (text) => text
      .replace(/^Turn right onto (.+)$/, 'Tournez à droite sur $1')
      .replace(/^Turn left onto (.+)$/, 'Tournez à gauche sur $1')
      .replace(/^Turn right$/, 'Tournez à droite')
      .replace(/^Turn left$/, 'Tournez à gauche')
      .replace(/^Continue$/, 'Continuez tout droit')
      .replace(/^Keep right$/, 'Restez à droite')
      .replace(/^Keep left$/, 'Restez à gauche')
  }
};

export function createFormatter(lang) {

  const config = languageConfig[lang];

  const formatter = new L.Routing.Formatter({
    language: lang === "NL" ? 'nl' : 'fr'
  });

  formatter.formatInstruction = function (instr) {

    let text = '';

    if (instr.type === 'Head') {
      text = config.text.Head;

      if (instr.dir) {
        text += lang === "NL"
          ? ' richting ' + (config.directions[instr.dir] || instr.dir)
          : ' en direction de ' + (config.directions[instr.dir] || instr.dir);
      }

    } else if (instr.type === 'Fork') {
      if (instr.direction === 'right') {
        text = lang === "NL"
          ? 'Houd rechts aan bij de splitsing'
          : 'Restez à droite au carrefour';

      } else if (instr.direction === 'left') {
        text = lang === "NL"
          ? 'Houd links aan bij de splitsing'
          : 'Restez à gauche au carrefour';

      } else {
        text = lang === "NL"
          ? 'Kies een richting bij de splitsing'
          : 'Choisissez une direction au carrefour';
      }

    } else {

      text = config.text[instr.type];

      if (!text && instr.text) {
        text = config.fallback(instr.text);
      }
    }

    if (instr.road && !text.includes(instr.road)) {
      text += ` ${config.road} ${instr.road}`;
    }

    return text || instr.text;
  };

  return formatter;
}

