/*!
Copyright (C) 2021 John Nesky

Permission is hereby granted, free of charge, to any person obtaining a copy of 
this software and associated documentation files (the "Software"), to deal in 
the Software without restriction, including without limitation the rights to 
use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies 
of the Software, and to permit persons to whom the Software is furnished to do 
so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all 
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR 
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, 
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE 
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER 
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, 
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE 
SOFTWARE.
*/

export interface Dictionary<T> {
    [K: string]: T;
}

export interface DictionaryArray<T> extends ReadonlyArray<T> {
    dictionary: Dictionary<T>;
}

export const enum FilterType {
    lowPass,
    highPass,
    peak,
    length,
}

export const enum EnvelopeType {
    noteSize,
    none,
    punch,
    flare,
    twang,
    swell,
    tremolo,
    tremolo2,
    decay,
}

export const enum InstrumentType {
    chip,
    fm,
    noise,
    spectrum,
    drumset,
    harmonics,
    pwm,
    pickedString,
    customChipWave,
    mod,
    length,
}

export const enum DropdownID {
    Vibrato = 0,
    Pan = 1,
    Chord = 2,
    Transition = 3,
    FM = 4,

}

export const enum EffectType {
    reverb,
    chorus,
    panning,
    distortion,
    bitcrusher,
    noteFilter,
    echo,
    pitchShift,
    detune,
    vibrato,
    transition,
    chord,
    // If you add more, you'll also have to extend the bitfield used in Base64 which currently uses two six-bit characters.
    length,
}

export const enum NoteAutomationIndex {
    noteVolume,
    noteFilterAllFreqs,
    pulseWidth,
    stringSustain,
    unison,
    operatorFrequency0, operatorFrequency1, operatorFrequency2, operatorFrequency3,
    operatorAmplitude0, operatorAmplitude1, operatorAmplitude2, operatorAmplitude3,
    feedbackAmplitude,
    pitchShift,
    detune,
    vibratoDepth,
    noteFilterFreq0, noteFilterFreq1, noteFilterFreq2, noteFilterFreq3, noteFilterFreq4, noteFilterFreq5, noteFilterFreq6, noteFilterFreq7,
    noteFilterGain0, noteFilterGain1, noteFilterGain2, noteFilterGain3, noteFilterGain4, noteFilterGain5, noteFilterGain6, noteFilterGain7,
    length,
}

/*
export const enum InstrumentAutomationIndex {
    mixVolume,
    eqFilterAllFreqs,
    eqFilterFreq0, eqFilterFreq1, eqFilterFreq2, eqFilterFreq3, eqFilterFreq4, eqFilterFreq5, eqFilterFreq6, eqFilterFreq7,
    eqFilterGain0, eqFilterGain1, eqFilterGain2, eqFilterGain3, eqFilterGain4, eqFilterGain5, eqFilterGain6, eqFilterGain7,
    distortion,
    bitcrusherQuantization,
    bitcrusherFrequency,
    panning,
    chorus,
    echoSustain,
    //echoDelay, // Wait until tick settings can be computed once for multiple run lengths.
    reverb,
    length,
}
*/

export interface BeepBoxOption {
    readonly index: number;
    readonly name: string;
}

export interface Scale extends BeepBoxOption {
    readonly flags: ReadonlyArray<boolean>;
    readonly realName: string;
}

export interface Key extends BeepBoxOption {
    readonly isWhiteKey: boolean;
    readonly basePitch: number;
}

export interface Rhythm extends BeepBoxOption {
    readonly stepsPerBeat: number;
    readonly roundUpThresholds: number[] | null;
}

export interface ChipWave extends BeepBoxOption {
    readonly expression: number;
    samples: Float64Array;
}

export interface OperatorWave extends BeepBoxOption {
    samples: Float64Array;
}

export interface ChipNoise extends BeepBoxOption {
    readonly expression: number;
    readonly basePitch: number;
    readonly pitchFilterMult: number;
    readonly isSoft: boolean;
    samples: Float32Array | null;
}

export interface Transition extends BeepBoxOption {
    readonly isSeamless: boolean;
    readonly continues: boolean;
    readonly slides: boolean;
    readonly slideTicks: number;
    readonly includeAdjacentPatterns: boolean;
}

export interface Vibrato extends BeepBoxOption {
    readonly amplitude: number;
    readonly type: number;
    readonly delayTicks: number;
}

export interface VibratoType extends BeepBoxOption {
    readonly periodsSeconds: number[];
    readonly period: number;
}

export interface Unison extends BeepBoxOption {
    readonly voices: number;
    readonly spread: number;
    readonly offset: number;
    readonly expression: number;
    readonly sign: number;
}

export interface Modulator extends BeepBoxOption {
    readonly name: string; // name that shows up in song editor UI
    readonly pianoName: string; // short name that shows up in mod piano UI
    readonly maxRawVol: number; // raw
    readonly newNoteVol: number; // raw
    readonly forSong: boolean; // true - setting is song scope
    convertRealFactor: number; // offset that needs to be applied to get a "real" number display of value, for UI purposes
    readonly associatedEffect: EffectType; // effect that should be enabled for this modulator to work properly. If unused, set to EffectType.length.

}

export interface Chord extends BeepBoxOption {
    readonly customInterval: boolean;
    readonly arpeggiates: boolean;
    readonly strumParts: number;
    readonly singleTone: boolean;
}

export interface Algorithm extends BeepBoxOption {
    readonly carrierCount: number;
    readonly associatedCarrier: ReadonlyArray<number>;
    readonly modulatedBy: ReadonlyArray<ReadonlyArray<number>>;
}

export interface OperatorFrequency extends BeepBoxOption {
    readonly mult: number;
    readonly hzOffset: number;
    readonly amplitudeSign: number;
}

export interface Feedback extends BeepBoxOption {
    readonly indices: ReadonlyArray<ReadonlyArray<number>>;
}

export interface Envelope extends BeepBoxOption {
    readonly type: EnvelopeType;
    readonly speed: number;
}

export interface AutomationTarget extends BeepBoxOption {
    readonly computeIndex: NoteAutomationIndex /*| InstrumentAutomationIndex*/ | null;
    readonly displayName: string;
    //readonly perNote: boolean; // Whether to compute envelopes on a per-note basis.
    readonly interleave: boolean; // Whether to interleave this target with the next one in the menu.
    readonly isFilter: boolean; // Filters have a variable maxCount in practice.
    //readonly range: number | null; // set if automation is allowed.
    readonly maxCount: number;
    readonly effect: EffectType | null;
    readonly compatibleInstruments: InstrumentType[] | null;
}

export class Config {
	// Params for post-processing compressor
	public static thresholdVal: number = -10;
	public static kneeVal: number = 40;
	public static ratioVal: number = 12;
	public static attackVal: number = 0;
	public static releaseVal: number = 0.25;

	public static readonly scales: DictionaryArray<Scale> = toNameMap([

		//   C     Db      D     Eb      E      F     F#      G     Ab      A     Bb      B      C
		{ name: "Free", realName: "chromatic", flags: [true, true, true, true, true, true, true, true, true, true, true, true] }, // Free
		{ name: "Major", realName: "ionian", flags: [true, false, true, false, true, true, false, true, false, true, false, true] }, // Major
		{ name: "Minor", realName: "aeolian", flags: [true, false, true, true, false, true, false, true, true, false, true, false] }, // Minor
		{ name: "Mixolydian", realName: "mixolydian", flags: [true, false, true, false, true, true, false, true, false, true, true, false] }, // Mixolydian
		{ name: "Lydian", realName: "lydian", flags: [true, false, true, false, true, false, true, true, false, true, false, true] }, // Lydian
		{ name: "Dorian", realName: "dorian", flags: [true, false, true, true, false, true, false, true, false, true, true, false] }, // Dorian
		{ name: "Phrygian", realName: "phrygian", flags: [true, true, false, true, false, true, false, true, true, false, true, false] }, // Phrygian
		{ name: "Locrian", realName: "locrian", flags: [true, true, false, true, false, true, true, false, true, false, true, false] }, // Locrian
		{ name: "Lydian Dominant", realName: "lydian dominant", flags: [true, false, true, false, true, false, true, true, false, true, true, false] }, // Lydian Dominant
		{ name: "Phrygian Dominant", realName: "phrygian dominant", flags: [true, true, false, false, true, true, false, true, true, false, true, false] }, // Phrygian Dominant
		{ name: "Harmonic Major", realName: "harmonic major", flags: [true, false, true, false, true, true, false, true, true, false, false, true] }, // Harmonic Major
		{ name: "Harmonic Minor", realName: "harmonic minor", flags: [true, false, true, true, false, true, false, true, true, false, false, true] }, // Harmonic Minor
		{ name: "Melodic Minor", realName: "melodic minor", flags: [true, false, true, true, false, true, false, true, false, true, false, true] }, // Melodic Minor
		{ name: "Blues", realName: "blues", flags: [true, false, false, true, false, true, true, true, false, false, true, false] }, // Blues
		{ name: "Altered", realName: "altered", flags: [true, true, false, true, true, false, true, false, true, false, true, false] }, // Altered
		{ name: "Major Pentatonic", realName: "major pentatonic", flags: [true, false, true, false, true, false, false, true, false, true, false, false] }, // Major Pentatonic
		{ name: "Minor Pentatonic", realName: "minor pentatonic", flags: [true, false, false, true, false, true, false, true, false, false, true, false] }, // Minor Pentatonic
		{ name: "Whole Tone", realName: "whole tone", flags: [true, false, true, false, true, false, true, false, true, false, true, false] }, // Whole Tone
		{ name: "Octatonic", realName: "octatonic", flags: [true, false, true, true, false, true, true, false, true, true, false, true] }, // Octatonic
		{ name: "Hexatonic", realName: "hexatonic", flags: [true, false, false, true, true, false, false, true, true, false, false, true] }, // Hexatonic


	]);
	public static readonly keys: DictionaryArray<Key> = toNameMap([
		{ name: "0", isWhiteKey: true, basePitch: 0 }, // C0 has index 12 on the MIDI scale. C7 is 96, and C9 is 120. C10 is barely in the audible range.
		{ name: "1", isWhiteKey: false, basePitch: 1 }, // TODO: I lowered these by 12, idk if I still want to have midi import so I might have to adjust if I don't.
		{ name: "2", isWhiteKey: true, basePitch: 2 },
		{ name: "3", isWhiteKey: false, basePitch: 3 },
		{ name: "4", isWhiteKey: true, basePitch: 4 },
		{ name: "5", isWhiteKey: true, basePitch: 5 },
		{ name: "6", isWhiteKey: false, basePitch: 6 },
		{ name: "7", isWhiteKey: true, basePitch: 7 },
		{ name: "8", isWhiteKey: false, basePitch: 8 },
		{ name: "9", isWhiteKey: true, basePitch: 9 },
		{ name: "A", isWhiteKey: false, basePitch: 10 },
		{ name: "B", isWhiteKey: true, basePitch: 11 },
	]);
	// public static readonly blackKeyNameParents: ReadonlyArray<number> = [-1, 1, -1, 1, -1, 1, -1, -1, 1, -1, 1, -1]; // key relic (TODO)
	public static readonly blackKeyNameParents: ReadonlyArray<number> = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];
	public static readonly tempoMin: number = 16;
	public static readonly tempoMax: number = 512;
	public static readonly reverbRange: number = 32;
	public static readonly beatsPerBarMin: number = 1;
	public static readonly beatsPerBarMax: number = 32;
	public static readonly barCountMin: number = 1;
	public static readonly barCountMax: number = 512;
	public static readonly edoMin: number = 1;
	public static readonly edoMax: number = 53; // want 72
	public static readonly instrumentsPerChannelMin: number = 1;
	public static readonly instrumentsPerChannelMax: number = 16;
	public static readonly partsPerBeat: number = 48; // prev 24;
	public static readonly ticksPerPart: number = 2;
	public static readonly ticksPerArpeggio: number = 3;
	public static readonly arpeggioPatterns: ReadonlyArray<ReadonlyArray<number>> = [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3], [0, 1, 2, 3, 4], [0, 1, 2, 3, 4, 5], [0, 1, 2, 3, 4, 5, 6], [0, 1, 2, 3, 4, 5, 6, 7]];
	public static readonly rhythms: DictionaryArray<Rhythm> = toNameMap([
		{ name: "÷1 (singlets '_')", stepsPerBeat: 1, /*ticksPerArpeggio: 4, arpeggioPatterns: [[0], [0, 0, 1, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: [/*0*/ 5, /*8*/ 12, /*16*/ 18 /*24*/] },
		{ name: "÷2 (duplets)", stepsPerBeat: 2, /*ticksPerArpeggio: 4, arpeggioPatterns: [[0], [0, 0, 1, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: [/*0*/ 5, /*8*/ 12, /*16*/ 18 /*24*/] },
		{ name: "÷3 (triplets)", stepsPerBeat: 3, /*ticksPerArpeggio: 4, arpeggioPatterns: [[0], [0, 0, 1, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: [/*0*/ 5, /*8*/ 12, /*16*/ 18 /*24*/] },
		{ name: "÷4 (standard)", stepsPerBeat: 4, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 0, 1, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: [/*0*/ 3, /*6*/ 9, /*12*/ 17, /*18*/ 21 /*24*/] },
		{ name: "÷5", stepsPerBeat: 5, /*ticksPerArpeggio: 4, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
		{ name: "÷6", stepsPerBeat: 6, /*ticksPerArpeggio: 4, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
		{ name: "÷8", stepsPerBeat: 8, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
		{ name: "÷9", stepsPerBeat: 9, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
		{ name: "÷12", stepsPerBeat: 12, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
		{ name: "÷16", stepsPerBeat: 16, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
		{ name: "÷24 (freehand)", stepsPerBeat: 24, /*ticksPerArpeggio: 3, arpeggioPatterns: [[0], [0, 1], [0, 1, 2, 1], [0, 1, 2, 3]]*/ roundUpThresholds: null },
	]);

	public static readonly instrumentTypeNames: ReadonlyArray<string> = ["chip", "FM", "noise", "spectrum", "drumset", "harmonics", "PWM", "custom chip", "mod"];
	public static readonly instrumentTypeHasSpecialInterval: ReadonlyArray<boolean> = [true, true, false, false, false, true, false, true];
	public static readonly chipWaves: DictionaryArray<ChipWave> = toNameMap([
		{ name: "rounded", volume: 0.94, samples: centerWave([0.0, 0.2, 0.4, 0.5, 0.6, 0.7, 0.8, 0.85, 0.9, 0.95, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 0.95, 0.9, 0.85, 0.8, 0.7, 0.6, 0.5, 0.4, 0.2, 0.0, -0.2, -0.4, -0.5, -0.6, -0.7, -0.8, -0.85, -0.9, -0.95, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -0.95, -0.9, -0.85, -0.8, -0.7, -0.6, -0.5, -0.4, -0.2]) },
		{ name: "triangle", volume: 1.0, samples: centerWave([1.0 / 15.0, 3.0 / 15.0, 5.0 / 15.0, 7.0 / 15.0, 9.0 / 15.0, 11.0 / 15.0, 13.0 / 15.0, 15.0 / 15.0, 15.0 / 15.0, 13.0 / 15.0, 11.0 / 15.0, 9.0 / 15.0, 7.0 / 15.0, 5.0 / 15.0, 3.0 / 15.0, 1.0 / 15.0, -1.0 / 15.0, -3.0 / 15.0, -5.0 / 15.0, -7.0 / 15.0, -9.0 / 15.0, -11.0 / 15.0, -13.0 / 15.0, -15.0 / 15.0, -15.0 / 15.0, -13.0 / 15.0, -11.0 / 15.0, -9.0 / 15.0, -7.0 / 15.0, -5.0 / 15.0, -3.0 / 15.0, -1.0 / 15.0]) },
		{ name: "square", volume: 0.5, samples: centerWave([1.0, -1.0]) },
		{ name: "1/4 pulse", volume: 0.5, samples: centerWave([1.0, -1.0, -1.0, -1.0]) },
		{ name: "1/8 pulse", volume: 0.5, samples: centerWave([1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0]) },
		{ name: "sawtooth", volume: 0.65, samples: centerWave([1.0 / 31.0, 3.0 / 31.0, 5.0 / 31.0, 7.0 / 31.0, 9.0 / 31.0, 11.0 / 31.0, 13.0 / 31.0, 15.0 / 31.0, 17.0 / 31.0, 19.0 / 31.0, 21.0 / 31.0, 23.0 / 31.0, 25.0 / 31.0, 27.0 / 31.0, 29.0 / 31.0, 31.0 / 31.0, -31.0 / 31.0, -29.0 / 31.0, -27.0 / 31.0, -25.0 / 31.0, -23.0 / 31.0, -21.0 / 31.0, -19.0 / 31.0, -17.0 / 31.0, -15.0 / 31.0, -13.0 / 31.0, -11.0 / 31.0, -9.0 / 31.0, -7.0 / 31.0, -5.0 / 31.0, -3.0 / 31.0, -1.0 / 31.0]) },
		{ name: "double saw", volume: 0.5, samples: centerWave([0.0, -0.2, -0.4, -0.6, -0.8, -1.0, 1.0, -0.8, -0.6, -0.4, -0.2, 1.0, 0.8, 0.6, 0.4, 0.2]) },
		{ name: "double pulse", volume: 0.4, samples: centerWave([1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0]) },
		{ name: "spiky", volume: 0.4, samples: centerWave([1.0, -1.0, 1.0, -1.0, 1.0, 0.0]) },
		{ name: "sine", volume: 0.88, samples: centerAndNormalizeWave([8.0, 9.0, 11.0, 12.0, 13.0, 14.0, 15.0, 15.0, 15.0, 15.0, 14.0, 14.0, 13.0, 11.0, 10.0, 9.0, 7.0, 6.0, 4.0, 3.0, 2.0, 1.0, 0.0, 0.0, 0.0, 0.0, 1.0, 1.0, 2.0, 4.0, 5.0, 6.0]) },
		{ name: "flute", volume: 0.8, samples: centerAndNormalizeWave([3.0, 4.0, 6.0, 8.0, 10.0, 11.0, 13.0, 14.0, 15.0, 15.0, 14.0, 13.0, 11.0, 8.0, 5.0, 3.0]) },
		{ name: "harp", volume: 0.8, samples: centerAndNormalizeWave([0.0, 3.0, 3.0, 3.0, 4.0, 5.0, 5.0, 6.0, 7.0, 8.0, 9.0, 11.0, 11.0, 13.0, 13.0, 15.0, 15.0, 14.0, 12.0, 11.0, 10.0, 9.0, 8.0, 7.0, 7.0, 5.0, 4.0, 3.0, 2.0, 1.0, 0.0, 0.0]) },
		{ name: "sharp clarinet", volume: 0.38, samples: centerAndNormalizeWave([0.0, 0.0, 0.0, 1.0, 1.0, 8.0, 8.0, 9.0, 9.0, 9.0, 8.0, 8.0, 8.0, 8.0, 8.0, 9.0, 9.0, 7.0, 9.0, 9.0, 10.0, 4.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0, 0.0]) },
		{ name: "soft clarinet", volume: 0.45, samples: centerAndNormalizeWave([0.0, 1.0, 5.0, 8.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 9.0, 11.0, 11.0, 12.0, 13.0, 12.0, 10.0, 9.0, 7.0, 6.0, 4.0, 3.0, 3.0, 3.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0]) },
		{ name: "alto sax", volume: 0.3, samples: centerAndNormalizeWave([5.0, 5.0, 6.0, 4.0, 3.0, 6.0, 8.0, 7.0, 2.0, 1.0, 5.0, 6.0, 5.0, 4.0, 5.0, 7.0, 9.0, 11.0, 13.0, 14.0, 14.0, 14.0, 14.0, 13.0, 10.0, 8.0, 7.0, 7.0, 4.0, 3.0, 4.0, 2.0]) },
		{ name: "bassoon", volume: 0.35, samples: centerAndNormalizeWave([9.0, 9.0, 7.0, 6.0, 5.0, 4.0, 4.0, 4.0, 4.0, 5.0, 7.0, 8.0, 9.0, 10.0, 11.0, 13.0, 13.0, 11.0, 10.0, 9.0, 7.0, 6.0, 4.0, 2.0, 1.0, 1.0, 1.0, 2.0, 2.0, 5.0, 11.0, 14.0]) },
		{ name: "trumpet", volume: 0.22, samples: centerAndNormalizeWave([10.0, 11.0, 8.0, 6.0, 5.0, 5.0, 5.0, 6.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 7.0, 7.0, 7.0, 7.0, 7.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 6.0, 7.0, 8.0, 9.0, 11.0, 14.0]) },
		{ name: "electric guitar", volume: 0.2, samples: centerAndNormalizeWave([11.0, 12.0, 12.0, 10.0, 6.0, 6.0, 8.0, 0.0, 2.0, 4.0, 8.0, 10.0, 9.0, 10.0, 1.0, 7.0, 11.0, 3.0, 6.0, 6.0, 8.0, 13.0, 14.0, 2.0, 0.0, 12.0, 8.0, 4.0, 13.0, 11.0, 10.0, 13.0]) },
		{ name: "organ", volume: 0.2, samples: centerAndNormalizeWave([11.0, 10.0, 12.0, 11.0, 14.0, 7.0, 5.0, 5.0, 12.0, 10.0, 10.0, 9.0, 12.0, 6.0, 4.0, 5.0, 13.0, 12.0, 12.0, 10.0, 12.0, 5.0, 2.0, 2.0, 8.0, 6.0, 6.0, 5.0, 8.0, 3.0, 2.0, 1.0]) },
		{ name: "pan flute", volume: 0.35, samples: centerAndNormalizeWave([1.0, 4.0, 7.0, 6.0, 7.0, 9.0, 7.0, 7.0, 11.0, 12.0, 13.0, 15.0, 13.0, 11.0, 11.0, 12.0, 13.0, 10.0, 7.0, 5.0, 3.0, 6.0, 10.0, 7.0, 3.0, 3.0, 1.0, 0.0, 1.0, 0.0, 1.0, 0.0]) },
		{ name: "glitch", volume: 0.5, samples: centerWave([1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0, -1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, -1.0, -1.0]) },
	]);
	// Noise waves have too many samples to write by hand, they're generated on-demand by getDrumWave instead.
	public static readonly chipNoises: DictionaryArray<ChipNoise> = toNameMap([
		{ name: "retro", volume: 0.25, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		{ name: "white", volume: 1.0, basePitch: 69, pitchFilterMult: 8.0, isSoft: true, samples: null },
		// The "clang" and "buzz" noises are based on similar noises in the modded beepbox! :D
		{ name: "clang", volume: 0.4, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		{ name: "buzz", volume: 0.3, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		{ name: "hollow", volume: 1.5, basePitch: 96, pitchFilterMult: 1.0, isSoft: true, samples: null },
		{ name: "shine", volume: 1.0, basePitch: 69, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		{ name: "deep", volume: 1.5, basePitch: 120, pitchFilterMult: 1024.0, isSoft: true, samples: null },
		{ name: "cutter", volume: 0.005, basePitch: 96, pitchFilterMult: 1024.0, isSoft: false, samples: null },
		{ name: "metallic", volume: 1.0, basePitch: 96, pitchFilterMult: 1024.0, isSoft: false, samples: null },
	]);
	public static readonly filterCutoffMaxHz: number = 8000; // This is carefully calculated to correspond to no change when filtering at 48000 samples per second.
	public static readonly filterCutoffMinHz: number = 1;
	public static readonly filterMax: number = 0.95;
	public static readonly filterMaxResonance: number = 0.95;
	public static readonly filterCutoffRange: number = 11;
	public static readonly filterResonanceRange: number = 8;
	public static readonly transitions: DictionaryArray<Transition> = toNameMap([
		{ name: "seamless", isSeamless: true, attackSeconds: 0.0, releases: false, releaseTicks: 1, slides: false, slideTicks: 3 },
		{ name: "hard", isSeamless: false, attackSeconds: 0.0, releases: false, releaseTicks: 3, slides: false, slideTicks: 3 },
		{ name: "soft", isSeamless: false, attackSeconds: 0.025, releases: false, releaseTicks: 3, slides: false, slideTicks: 3 },
		{ name: "slide", isSeamless: true, attackSeconds: 0.025, releases: false, releaseTicks: 3, slides: true, slideTicks: 3 },
		{ name: "cross fade", isSeamless: false, attackSeconds: 0.04, releases: true, releaseTicks: 6, slides: false, slideTicks: 3 },
		{ name: "hard fade", isSeamless: false, attackSeconds: 0.0, releases: true, releaseTicks: 48, slides: false, slideTicks: 3 },
		{ name: "medium fade", isSeamless: false, attackSeconds: 0.0125, releases: true, releaseTicks: 72, slides: false, slideTicks: 3 },
		{ name: "soft fade", isSeamless: false, attackSeconds: 0.06, releases: true, releaseTicks: 96, slides: false, slideTicks: 6 },
	]);
	public static readonly vibratos: DictionaryArray<Vibrato> = toNameMap([
		{ name: "none", amplitude: 0.0, type: 0, delayParts: 0 },
		{ name: "light", amplitude: 0.15, type: 0, delayParts: 0 },
		{ name: "delayed", amplitude: 0.3, type: 0, delayParts: 18 },
		{ name: "heavy", amplitude: 0.45, type: 0, delayParts: 0 },
		{ name: "shaky", amplitude: 0.1, type: 1, delayParts: 0 },
	]);
	public static readonly vibratoTypes: DictionaryArray<VibratoType> = toNameMap([
		{ name: "normal", periodsSeconds: [0.14], period: 0.14 },
		{ name: "shaky", periodsSeconds: [0.11, 1.618 * 0.11, 3 * 0.11], period: 266.97 }, // LCM of all periods
	]);
	// This array is more or less a linear step by 0.1 but there's a bit of range added at the start to hit specific ratios, and the end starts to grow faster.
	//                                                             0       1      2    3     4      5    6    7      8     9   10   11 12   13   14   15   16   17   18   19   20   21 22   23   24   25   26   27   28   29   30   31 32   33   34   35   36   37   38    39  40   41 42    43   44   45   46 47   48 49 50
	public static readonly arpSpeedScale: ReadonlyArray<number> = [0, 0.0625, 0.125, 0.2, 0.25, 1 / 3, 0.4, 0.5, 2 / 3, 0.75, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2, 2.1, 2.2, 2.3, 2.4, 2.5, 2.6, 2.7, 2.8, 2.9, 3, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8, 3.9, 4, 4.15, 4.3, 4.5, 4.8, 5, 5.5, 6, 8];
	public static readonly intervals: DictionaryArray<Interval> = toNameMap([
		{ name: "union", spread: 0.0, offset: 0.0, volume: 0.7, sign: 1.0 },
		{ name: "shimmer", spread: 0.018, offset: 0.0, volume: 0.8, sign: 1.0 },
		{ name: "hum", spread: 0.045, offset: 0.0, volume: 1.0, sign: 1.0 },
		{ name: "honky tonk", spread: 0.09, offset: 0.0, volume: 1.0, sign: 1.0 },
		{ name: "dissonant", spread: 0.25, offset: 0.0, volume: 0.9, sign: 1.0 },
		{ name: "fifth", spread: 3.5, offset: 3.5, volume: 0.9, sign: 1.0 },
		{ name: "octave", spread: 6.0, offset: 6.0, volume: 0.8, sign: 1.0 },
		{ name: "bowed", spread: 0.02, offset: 0.0, volume: 1.0, sign: -1.0 },
		{ name: "piano", spread: 0.01, offset: 0.0, volume: 1.0, sign: 0.7 },
	]);
	public static readonly effectsNames: ReadonlyArray<string> = ["none", "reverb", "chorus", "chorus & reverb"];
	public static readonly volumeRange: number = 50;
	// Beepbox's old volume scale used factor -0.5 and was [0~7] had roughly value 6 = 0.125 power. This new value is chosen to have -21 be the same,
	// given that the new scale is [-25~25]. This is such that conversion between the scales is roughly equivalent by satisfying (0.5*6 = 0.1428*21)
	public static readonly volumeLogScale: number = 0.1428;
	public static readonly panCenter: number = 50;
	public static readonly panMax: number = Config.panCenter * 2;
	public static readonly detuneMin: number = -50;
	public static readonly detuneMax: number = 50;
	public static readonly songDetuneMin: number = -250;
	public static readonly songDetuneMax: number = 250;
	public static readonly chords: DictionaryArray<Chord> = toNameMap([
		{ name: "harmony", harmonizes: true, customInterval: false, arpeggiates: false, isCustomInterval: false, strumParts: 0 },
		{ name: "strum", harmonizes: true, customInterval: false, arpeggiates: false, isCustomInterval: false, strumParts: 1 },
		{ name: "arpeggio", harmonizes: false, customInterval: false, arpeggiates: true, isCustomInterval: false, strumParts: 0 },
		{ name: "custom interval", harmonizes: true, customInterval: true, arpeggiates: true, isCustomInterval: true, strumParts: 0 },
	]);
	public static readonly maxChordSize: number = 9; // Pandora's box... ?0_0
	public static readonly operatorCount: number = 4;
	public static readonly algorithms: DictionaryArray<Algorithm> = toNameMap([
		{ name: "1←(2 3 4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3, 4], [], [], []] },
		{ name: "1←(2 3←4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3], [], [4], []] },
		{ name: "1←2←(3 4)", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2], [3, 4], [], []] },
		{ name: "1←(2 3)←4", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2, 3], [4], [4], []] },
		{ name: "1←2←3←4", carrierCount: 1, associatedCarrier: [1, 1, 1, 1], modulatedBy: [[2], [3], [4], []] },
		{ name: "1←3 2←4", carrierCount: 2, associatedCarrier: [1, 2, 1, 2], modulatedBy: [[3], [4], [], []] },
		{ name: "1 2←(3 4)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[], [3, 4], [], []] },
		{ name: "1 2←3←4", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[], [3], [4], []] },
		{ name: "(1 2)←3←4", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[3], [3], [4], []] },
		{ name: "(1 2)←(3 4)", carrierCount: 2, associatedCarrier: [1, 2, 2, 2], modulatedBy: [[3, 4], [3, 4], [], []] },
		{ name: "1 2 3←4", carrierCount: 3, associatedCarrier: [1, 2, 3, 3], modulatedBy: [[], [], [4], []] },
		{ name: "(1 2 3)←4", carrierCount: 3, associatedCarrier: [1, 2, 3, 3], modulatedBy: [[4], [4], [4], []] },
		{ name: "1 2 3 4", carrierCount: 4, associatedCarrier: [1, 2, 3, 4], modulatedBy: [[], [], [], []] },
	]);
	public static readonly operatorCarrierInterval: ReadonlyArray<number> = [0.0, 0.04, -0.073, 0.091];
	public static readonly operatorAmplitudeMax: number = 15;
	public static readonly operatorFrequencies: DictionaryArray<OperatorFrequency> = toNameMap([
		{ name: "1×", mult: 1.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "~1×", mult: 1.0, hzOffset: 1.5, amplitudeSign: -1.0 },
		{ name: "2×", mult: 2.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "~2×", mult: 2.0, hzOffset: -1.3, amplitudeSign: -1.0 },
		{ name: "3×", mult: 3.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "4×", mult: 4.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "5×", mult: 5.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "6×", mult: 6.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "7×", mult: 7.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "8×", mult: 8.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "9×", mult: 9.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "11×", mult: 11.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "13×", mult: 13.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "16×", mult: 16.0, hzOffset: 0.0, amplitudeSign: 1.0 },
		{ name: "20×", mult: 20.0, hzOffset: 0.0, amplitudeSign: 1.0 },
	]);
	public static readonly envelopes: DictionaryArray<Envelope> = toNameMap([
		{ name: "custom", type: EnvelopeType.custom, speed: 0.0 },
		{ name: "steady", type: EnvelopeType.steady, speed: 0.0 },
		{ name: "punch", type: EnvelopeType.punch, speed: 0.0 },
		{ name: "flare 1", type: EnvelopeType.flare, speed: 32.0 },
		{ name: "flare 2", type: EnvelopeType.flare, speed: 8.0 },
		{ name: "flare 3", type: EnvelopeType.flare, speed: 2.0 },
		{ name: "twang 1", type: EnvelopeType.twang, speed: 32.0 },
		{ name: "twang 2", type: EnvelopeType.twang, speed: 8.0 },
		{ name: "twang 3", type: EnvelopeType.twang, speed: 2.0 },
		{ name: "swell 1", type: EnvelopeType.swell, speed: 32.0 },
		{ name: "swell 2", type: EnvelopeType.swell, speed: 8.0 },
		{ name: "swell 3", type: EnvelopeType.swell, speed: 2.0 },
		{ name: "tremolo1", type: EnvelopeType.tremolo, speed: 4.0 },
		{ name: "tremolo2", type: EnvelopeType.tremolo, speed: 2.0 },
		{ name: "tremolo3", type: EnvelopeType.tremolo, speed: 1.0 },
		{ name: "tremolo4", type: EnvelopeType.tremolo2, speed: 4.0 },
		{ name: "tremolo5", type: EnvelopeType.tremolo2, speed: 2.0 },
		{ name: "tremolo6", type: EnvelopeType.tremolo2, speed: 1.0 },
		{ name: "decay 1", type: EnvelopeType.decay, speed: 10.0 },
		{ name: "decay 2", type: EnvelopeType.decay, speed: 7.0 },
		{ name: "decay 3", type: EnvelopeType.decay, speed: 4.0 },
	]);
	public static readonly feedbacks: DictionaryArray<Feedback> = toNameMap([
		{ name: "1⟲", indices: [[1], [], [], []] },
		{ name: "2⟲", indices: [[], [2], [], []] },
		{ name: "3⟲", indices: [[], [], [3], []] },
		{ name: "4⟲", indices: [[], [], [], [4]] },
		{ name: "1⟲ 2⟲", indices: [[1], [2], [], []] },
		{ name: "3⟲ 4⟲", indices: [[], [], [3], [4]] },
		{ name: "1⟲ 2⟲ 3⟲", indices: [[1], [2], [3], []] },
		{ name: "2⟲ 3⟲ 4⟲", indices: [[], [2], [3], [4]] },
		{ name: "1⟲ 2⟲ 3⟲ 4⟲", indices: [[1], [2], [3], [4]] },
		{ name: "1→2", indices: [[], [1], [], []] },
		{ name: "1→3", indices: [[], [], [1], []] },
		{ name: "1→4", indices: [[], [], [], [1]] },
		{ name: "2→3", indices: [[], [], [2], []] },
		{ name: "2→4", indices: [[], [], [], [2]] },
		{ name: "3→4", indices: [[], [], [], [3]] },
		{ name: "1→3 2→4", indices: [[], [], [1], [2]] },
		{ name: "1→4 2→3", indices: [[], [], [2], [1]] },
		{ name: "1→2→3→4", indices: [[], [1], [2], [3]] },
	]);
	public static readonly chipNoiseLength: number = 1 << 15; // 32768
	public static readonly spectrumBasePitch: number = 24;
	public static readonly spectrumControlPoints: number = 30;
	public static readonly spectrumControlPointsPerOctave: number = 7;
	public static readonly spectrumControlPointBits: number = 3;
	public static readonly spectrumMax: number = (1 << Config.spectrumControlPointBits) - 1;
	public static readonly harmonicsControlPoints: number = 28;
	public static readonly harmonicsRendered: number = 64;
	public static readonly harmonicsControlPointBits: number = 3;
	public static readonly harmonicsMax: number = (1 << Config.harmonicsControlPointBits) - 1;
	public static readonly harmonicsWavelength: number = 1 << 11; // 2048
	public static readonly pulseWidthRange: number = 50;
	public static readonly pitchChannelCountMin: number = 1;
	public static readonly pitchChannelCountMax: number = 32;
	public static readonly noiseChannelCountMin: number = 0;
	public static readonly noiseChannelCountMax: number = 8;
	public static readonly modChannelCountMin: number = 0;
	public static readonly modChannelCountMax: number = 8;
	public static readonly noiseInterval: number = 6;
	public static readonly centerFrequency = 425.85465642512778279
	public static readonly pitchesPerOctave: number = 12;
	public static readonly drumCount: number = 12;
	public static readonly modCount: number = 6;
	public static readonly pitchOctaves: number = 9; // prev 8
	public static readonly maxScrollableOctaves: number = 5; // Largest number possible with any config setting
	public static readonly maxPitch: number = Config.pitchOctaves * Config.pitchesPerOctave;
	public static readonly maximumTonesPerChannel: number = Config.maxChordSize * 2;
	public static readonly sineWaveLength: number = 1 << 8; // 256
	public static readonly sineWaveMask: number = Config.sineWaveLength - 1;
	public static readonly sineWave: Float64Array = generateSineWave();

	// Height of the small editor column for inserting/deleting rows, in pixels.
	public static readonly barEditorHeight: number = 10;

}

function centerWave(wave: Array<number>): Float64Array {
    let sum: number = 0.0;
    for (let i: number = 0; i < wave.length; i++) sum += wave[i];
    const average: number = sum / wave.length;
    for (let i: number = 0; i < wave.length; i++) wave[i] -= average;
    performIntegral(wave);
    // The first sample should be zero, and we'll duplicate it at the end for easier interpolation.
    wave.push(0);
    return new Float64Array(wave);
}
function centerAndNormalizeWave(wave: Array<number>): Float64Array {
    let magn: number = 0.0;

    centerWave(wave);

    // Going to length-1 because an extra 0 sample is added on the end as part of centerWave, which shouldn't impact magnitude calculation.
    for (let i: number = 0; i < wave.length - 1; i++) {
        magn += Math.abs(wave[i]);
    }
    const magnAvg: number = magn / (wave.length - 1);

    for (let i: number = 0; i < wave.length - 1; i++) {
        wave[i] = wave[i] / magnAvg;
    }

    return new Float64Array(wave);

}
export function performIntegral(wave: { length: number, [index: number]: number }): Float64Array {
    // Perform the integral on the wave. The synth function will perform the derivative to get the original wave back but with antialiasing.
    let cumulative: number = 0.0;
    let newWave: Float64Array = new Float64Array(wave.length);
    for (let i: number = 0; i < wave.length; i++) {
        newWave[i] = cumulative;
        cumulative += wave[i];
    }

    return newWave;
}
export function performIntegralOld(wave: { length: number, [index: number]: number }): void {
	// Old ver used in harmonics/picked string instruments, manipulates wave in place.
	let cumulative: number = 0.0;
	for (let i: number = 0; i < wave.length; i++) {
		const temp = wave[i];
		wave[i] = cumulative;
		cumulative += temp;
	}
}

export function getPulseWidthRatio(pulseWidth: number): number {
    // BeepBox formula for reference
    //return Math.pow(0.5, (Config.pulseWidthRange - 1 - pulseWidth) * Config.pulseWidthStepPower) * 0.5;

    return pulseWidth / (Config.pulseWidthRange * 2);
}


// The function arguments will be defined in FFT.ts, but I want
// SynthConfig.ts to be at the top of the compiled JS so I won't directly
// depend on FFT here. synth.ts will take care of importing FFT.ts.
//function inverseRealFourierTransform(array: {length: number, [index: number]: number}, fullArrayLength: number): void;
//function scaleElementsByFactor(array: {length: number, [index: number]: number}, factor: number): void;
export function getDrumWave(index: number, inverseRealFourierTransform: Function | null, scaleElementsByFactor: Function | null): Float32Array {
    let wave: Float32Array | null = Config.chipNoises[index].samples;
    if (wave == null) {
        wave = new Float32Array(Config.chipNoiseLength + 1);
        Config.chipNoises[index].samples = wave;

        if (index == 0) {
            // The "retro" drum uses a "Linear Feedback Shift Register" similar to the NES noise channel.
            let drumBuffer: number = 1;
            for (let i: number = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                let newBuffer: number = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 1 << 14;
                }
                drumBuffer = newBuffer;
            }
        } else if (index == 1) {
            // White noise is just random values for each sample.
            for (let i: number = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = Math.random() * 2.0 - 1.0;
            }
        } else if (index == 2) {
            // The "clang" noise wave is based on a similar noise wave in the modded beepbox made by DAzombieRE.
            let drumBuffer: number = 1;
            for (let i: number = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                let newBuffer: number = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 2 << 14;
                }
                drumBuffer = newBuffer;
            }
        } else if (index == 3) {
            // The "buzz" noise wave is based on a similar noise wave in the modded beepbox made by DAzombieRE.
            let drumBuffer: number = 1;
            for (let i: number = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                let newBuffer: number = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 10 << 2;
                }
                drumBuffer = newBuffer;
            }
        } else if (index == 4) {
            // "hollow" drums, designed in frequency space and then converted via FFT:
            drawNoiseSpectrum(wave, Config.chipNoiseLength, 10, 11, 1, 1, 0);
            drawNoiseSpectrum(wave, Config.chipNoiseLength, 11, 14, .6578, .6578, 0);
            inverseRealFourierTransform!(wave, Config.chipNoiseLength);
            scaleElementsByFactor!(wave, 1.0 / Math.sqrt(Config.chipNoiseLength));
        } else if (index == 5) {
            // "Shine" drums from modbox!
            var drumBuffer = 1;
            for (var i = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 2.0 - 1.0;
                var newBuffer = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 10 << 2;
                }
                drumBuffer = newBuffer;
            }
        } else if (index == 6) {
            // "Deep" drums from modbox!
            drawNoiseSpectrum(wave, Config.chipNoiseLength, 1, 10, 1, 1, 0);
            drawNoiseSpectrum(wave, Config.chipNoiseLength, 20, 14, -2, -2, 0);
            inverseRealFourierTransform!(wave, Config.chipNoiseLength);
            scaleElementsByFactor!(wave, 1.0 / Math.sqrt(Config.chipNoiseLength));
        } else if (index == 7) {
            // "Cutter" drums from modbox!
            var drumBuffer = 1;
            for (var i = 0; i < Config.chipNoiseLength; i++) {
                wave[i] = (drumBuffer & 1) * 4.0 * (Math.random() * 14 + 1);
                var newBuffer = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer += 15 << 2;
                }
                drumBuffer = newBuffer;
            }
        } else if (index == 8) {
            // "Metallic" drums from modbox!
            var drumBuffer = 1;
            for (var i = 0; i < 32768; i++) {
                wave[i] = (drumBuffer & 1) / 2.0 + 0.5;
                var newBuffer = drumBuffer >> 1;
                if (((drumBuffer + newBuffer) & 1) == 1) {
                    newBuffer -= 10 << 2;
                }
                drumBuffer = newBuffer;
            }
        } else {
            throw new Error("Unrecognized drum index: " + index);
        }

        wave[Config.chipNoiseLength] = wave[0];
    }

    return wave;
}

export function drawNoiseSpectrum(wave: Float32Array, waveLength: number, lowOctave: number, highOctave: number, lowPower: number, highPower: number, overallSlope: number): number {
    const referenceOctave: number = 11;
    const referenceIndex: number = 1 << referenceOctave;
    const lowIndex: number = Math.pow(2, lowOctave) | 0;
    const highIndex: number = Math.min(waveLength >> 1, Math.pow(2, highOctave) | 0);
    const retroWave: Float32Array = getDrumWave(0, null, null);
    let combinedAmplitude: number = 0.0;
    for (let i: number = lowIndex; i < highIndex; i++) {

        let lerped: number = lowPower + (highPower - lowPower) * (Math.log2(i) - lowOctave) / (highOctave - lowOctave);
        let amplitude: number = Math.pow(2, (lerped - 1) * 7 + 1) * lerped;

        amplitude *= Math.pow(i / referenceIndex, overallSlope);

        combinedAmplitude += amplitude;

        // Add two different sources of psuedo-randomness to the noise
        // (individually they aren't random enough) but in a deterministic
        // way so that live spectrum editing doesn't result in audible pops.
        // Multiply all the sine wave amplitudes by 1 or -1 based on the
        // LFSR retro wave (effectively random), and also rotate the phase
        // of each sine wave based on the golden angle to disrupt the symmetry.
        amplitude *= retroWave[i];
        const radians: number = 0.61803398875 * i * i * Math.PI * 2.0;

        wave[i] = Math.cos(radians) * amplitude;
        wave[waveLength - i] = Math.sin(radians) * amplitude;
    }

    return combinedAmplitude;
}

function generateSineWave(): Float64Array {
    const wave: Float64Array = new Float64Array(Config.sineWaveLength + 1);
    for (let i: number = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength);
    }
    return wave;
}

function generateTriWave(): Float64Array {
    const wave: Float64Array = new Float64Array(Config.sineWaveLength + 1);
    for (let i: number = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = Math.asin(Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength)) / (Math.PI / 2);
    }
    return wave;
}

function generateTrapezoidWave(drive: number = 2): Float64Array {
    const wave: Float64Array = new Float64Array(Config.sineWaveLength + 1);
    for (let i: number = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = Math.max(-1.0, Math.min(1.0, Math.asin(Math.sin(i * Math.PI * 2.0 / Config.sineWaveLength)) * drive));
    }
    return wave;
}

function generateSquareWave(phaseWidth: number = 0): Float64Array {
    const wave: Float64Array = new Float64Array(Config.sineWaveLength + 1);
    const centerPoint: number = Config.sineWaveLength / 4;
    for (let i: number = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = +((Math.abs(i - centerPoint) < phaseWidth * Config.sineWaveLength / 2)
            || ((Math.abs(i - Config.sineWaveLength - centerPoint) < phaseWidth * Config.sineWaveLength / 2))) * 2 - 1;
    }
    return wave;
}

function generateSawWave(inverse: boolean = false): Float64Array {
    const wave: Float64Array = new Float64Array(Config.sineWaveLength + 1);
    for (let i: number = 0; i < Config.sineWaveLength + 1; i++) {
        wave[i] = ((i + (Config.sineWaveLength / 4.0)) * 2.0 / Config.sineWaveLength) % 2 - 1;
        wave[i] = inverse ? -wave[i] : wave[i];
    }
    return wave;
}

export function getArpeggioPitchIndex(pitchCount: number, useFastTwoNoteArp: boolean, arpeggio: number): number {
    let arpeggioPattern: ReadonlyArray<number> = Config.arpeggioPatterns[pitchCount - 1];
    if (arpeggioPattern != null) {
        if (pitchCount == 2 && useFastTwoNoteArp == false) {
            arpeggioPattern = [0, 0, 1, 1];
        }
        return arpeggioPattern[arpeggio % arpeggioPattern.length];
    } else {
        return arpeggio % pitchCount;
    }
}

// Pardon the messy type casting. This allows accessing array members by numerical index or string name.
export function toNameMap<T extends BeepBoxOption>(array: Array<Pick<T, Exclude<keyof T, "index">>>): DictionaryArray<T> {
    const dictionary: Dictionary<T> = {};
    for (let i: number = 0; i < array.length; i++) {
        const value: any = array[i];
        value.index = i;
        dictionary[value.name] = <T>value;
    }
    const result: DictionaryArray<T> = <DictionaryArray<T>><any>array;
    result.dictionary = dictionary;
    return result;
}

export function effectsIncludeTransition(effects: number): boolean {
    return (effects & (1 << EffectType.transition)) != 0;
}
export function effectsIncludeChord(effects: number): boolean {
    return (effects & (1 << EffectType.chord)) != 0;
}
export function effectsIncludePitchShift(effects: number): boolean {
    return (effects & (1 << EffectType.pitchShift)) != 0;
}
export function effectsIncludeDetune(effects: number): boolean {
    return (effects & (1 << EffectType.detune)) != 0;
}
export function effectsIncludeVibrato(effects: number): boolean {
    return (effects & (1 << EffectType.vibrato)) != 0;
}
export function effectsIncludeNoteFilter(effects: number): boolean {
    return (effects & (1 << EffectType.noteFilter)) != 0;
}
export function effectsIncludeDistortion(effects: number): boolean {
    return (effects & (1 << EffectType.distortion)) != 0;
}
export function effectsIncludeBitcrusher(effects: number): boolean {
    return (effects & (1 << EffectType.bitcrusher)) != 0;
}
export function effectsIncludePanning(effects: number): boolean {
    return (effects & (1 << EffectType.panning)) != 0;
}
export function effectsIncludeChorus(effects: number): boolean {
    return (effects & (1 << EffectType.chorus)) != 0;
}
export function effectsIncludeEcho(effects: number): boolean {
    return (effects & (1 << EffectType.echo)) != 0;
}
export function effectsIncludeReverb(effects: number): boolean {
    return (effects & (1 << EffectType.reverb)) != 0;
}
export function rawChipToIntegrated(raw: DictionaryArray<ChipWave>): DictionaryArray<ChipWave> {
    const newArray: Array<ChipWave> = new Array<ChipWave>(raw.length);
    const dictionary: Dictionary<ChipWave> = {};
    for (let i: number = 0; i < newArray.length; i++) {
        newArray[i] = Object.assign([], raw[i]);
        const value: any = newArray[i];
        value.index = i;
        dictionary[value.name] = <ChipWave>value;
    }
    for (let key in dictionary) {
        dictionary[key].samples = performIntegral(dictionary[key].samples);
    }
    const result: DictionaryArray<ChipWave> = <DictionaryArray<ChipWave>><any>newArray;
    result.dictionary = dictionary;
    return result;
}
//}
