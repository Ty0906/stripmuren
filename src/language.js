'use strict';



export function createFormatterNL() {
    const formatterNL = new L.Routing.Formatter({
    language: 'nl'
    });

    formatterNL.formatInstruction = function (instr) {
        let text = '';

        switch (instr.type) {
        case 'Head':
            text = 'Vertrek';
            if (instr.dir) text += ' richting ' + vertaalRichtingNL(instr.dir);
            break;

        case 'Straight':
        case 'Continue':
            text = 'Ga rechtdoor';
            break;

        case 'Right':
        case 'TurnRight' :
            text = 'Sla rechtsaf';
            break;

        case 'Left':
        case 'Turnleft' :
            text = 'Sla linksaf';
            break;

        case 'SlightRight':
        case 'KeepRight' :
            text = 'Houd rechts aan';
            break;

        case 'SlightLeft':
        case 'KeepLeft' :
            text = 'Houd links aan';
            break;

        case 'SharpRight':
            text = 'Sla scherp rechtsaf';
            break;

        case 'SharpLeft':
            text = 'Sla scherp linksaf';
            break;

        case 'TurnAround':
            text = 'Keer om';
            break;

        case 'Roundabout':
            text = 'Neem de rotonde';
            break;

        case 'WaypointReached':
            text = 'Tussenpunt bereikt';
            break;

        case 'DestinationReached':
            text = 'Bestemming bereikt';
            break;

        case 'Fork':
            text = instr.direction === 'right' ? 'Houd rechts aan bij de splitsing' :
            instr.direction === 'left' ? 'Houd links aan bij de splitsing' :
            'Kies een richting bij de splitsing';
            break;

        default:
        // 👉 fallback voor Engelse instructies
        text = vertaalEngelseTurn(instr);
        break;
        }


    // Voeg straatnaam toe als die bestaat en nog niet in de text staat
    if (instr.road && !text.includes(instr.road)) {
        text += ' op ' + instr.road;
    }
    

        return text || instr.text;
    };

    function vertaalRichtingNL(dir) {
        const map = {
        N: 'noord',
        NE: 'noordoost',
        E: 'oost',
        SE: 'zuidoost',
        S: 'zuid',
        SW: 'zuidwest',
        W: 'west',
        NW: 'noordwest'
        };
        return map[dir] || dir;
    }

    function vertaalEngelseTurn(instr) {
    if (!instr.text) return '';

    return instr.text
        .replace(/^Turn right onto (.+)$/, 'Sla rechtsaf op $1')
        .replace(/^Turn left onto (.+)$/, 'Sla linksaf op $1')
        .replace(/^Turn right$/, 'Sla rechtsaf')
        .replace(/^Turn left$/, 'Sla linksaf')
        .replace(/^Continue$/, 'Ga rechtdoor')
        .replace(/^Keep right$/, 'Houd rechts aan')
        .replace(/^Keep left$/, 'Houd links aan');
    }

    return formatterNL;
}

export function createFormatterFR() {

    const formatterFR = new L.Routing.Formatter({
    language: 'fr'
    });

    formatterFR.formatInstruction = function (instr) {
    let text = '';

    switch (instr.type) {
        case 'Head':
        text = 'Départ';
        if (instr.dir) text += ' en direction de ' + vertaalRichtingFR(instr.dir);
        break;
        case 'Straight':
        case 'Continue':
        text = 'Continuez tout droit';
        break;
        case 'Right':
        case 'TurnRight':
        text = 'Tournez à droite';
        break;
        case 'Left':
        case 'TurnLeft':
        text = 'Tournez à gauche';
        break;
        case 'SlightRight':
        case 'KeepRight':
        text = 'Restez légèrement à droite';
        break;
        case 'SlightLeft':
        case 'KeepLeft':
        text = 'Restez légèrement à gauche';
        break;
        case 'SharpRight':
        text = 'Tournez fortement à droite';
        break;
        case 'SharpLeft':
        text = 'Tournez fortement à gauche';
        break;
        case 'TurnAround':
        text = 'Faites demi-tour';
        break;
        case 'Roundabout':
        text = 'Prenez le rond-point';
        break;
        case 'Fork':
        if (instr.direction === 'right') text = 'Restez à droite au carrefour';
        else if (instr.direction === 'left') text = 'Restez à gauche au carrefour';
        else text = 'Choisissez une direction au carrefour';
        break;
        case 'WaypointReached':
        text = 'Point intermédiaire atteint';
        break;
        case 'DestinationReached':
        text = 'Destination atteinte';
        break;
        default:
        text = vertaalEngelseTurnFR(instr);
        break;
    }

    
    if (instr.road && !text.includes(instr.road)) {
        text += ' sur ' + instr.road;
    }

    return text || instr.text; 
    };

    function vertaalRichtingFR(dir) {
    const map = {
        N: 'nord',
        NE: 'nord-est',
        E: 'est',
        SE: 'sud-est',
        S: 'sud',
        SW: 'sud-ouest',
        W: 'ouest',
        NW: 'nord-ouest'
    };
    return map[dir] || dir;
    }

    function vertaalEngelseTurnFR(instr) {
    if (!instr.text) return '';

    return instr.text
        .replace(/^Turn right onto (.+)$/, 'Tournez à droite sur $1')
        .replace(/^Turn left onto (.+)$/, 'Tournez à gauche sur $1')
        .replace(/^Turn right$/, 'Tournez à droite')
        .replace(/^Turn left$/, 'Tournez à gauche')
        .replace(/^Continue$/, 'Continuez tout droit')
        .replace(/^Keep right$/, 'Restez à droite')
        .replace(/^Keep left$/, 'Restez à gauche');
    }

    return formatterFR;
}

