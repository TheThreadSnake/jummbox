// Copyright (C) 2021 John Nesky, distributed under the MIT license.

import { Config } from "../synth/SynthConfig";
import { HTML } from "imperative-html/dist/esm/elements-strict";
import { SongDocument } from "./SongDocument";
import { Prompt } from "./Prompt";
import { ChangeGroup } from "./Change";
import { ChangeBeatsPerBar, ChangeBarCount, ChangeEdo } from "./changes";
import { ColorConfig } from "./ColorConfig";

	const {button, div, span, h2, input, br, select, option} = HTML;

export class SongSettingsPrompt implements Prompt {
	private readonly _edoStepper: HTMLInputElement = input({ style: "width: 3em; margin-left: 1em;", type: "number", step: "1" });
	private readonly _beatsStepper: HTMLInputElement = input({ style: "width: 3em; margin-left: 1em;", type: "number", step: "1" });
	private readonly _conversionStrategySelect: HTMLSelectElement = select({ style: "width: 100%;" },
		option({ value: "splice" }, "Splice beats at end of bars."),
		option({ value: "stretch" }, "Stretch notes to fit in bars."),
		option({ value: "overflow" }, "Overflow notes across bars."),
	);
	private readonly _barsStepper: HTMLInputElement = input({ style: "width: 3em; margin-left: 1em;", type: "number", step: "1" });
	private readonly _positionSelect: HTMLSelectElement = select({ style: "width: 100%;" },
		option({ value: "end" }, "Apply change at end of song."),
		option({ value: "beginning" }, "Apply change at beginning of song."),
	);

	private readonly _cancelButton: HTMLButtonElement = button({ class: "cancelButton" });
	private readonly _okayButton: HTMLButtonElement = button({ class: "okayButton", style: "width:45%;" }, "Okay");

	public readonly container: HTMLDivElement = div({ class: "prompt noSelection", style: "width: 250px;" },
		h2("Song Settings"),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ style: "text-align: right;" },
				"Pitch Divisions per Octave:",
				br(),
				span({ style: "font-size: smaller; color: #888888;" }, "(Equal Temperament)"),
				br(),
				span({ style: "font-size: smaller; color: #aa3000;" }, "Warning: This skews pitches and can delete existing notes!"),
				br(),
				),
			this._edoStepper,
		),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ style: "display: inline-block; text-align: right;" },
				"Bars per song:",
				br(),
					span({style: `font-size: smaller; color: ${ColorConfig.secondaryText};`}, "(Multiples of 4 are recommended)"),

			),
			this._barsStepper,
		),
			div({style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;"},
				div({class: "selectContainer", style: "width: 100%;"}, this._positionSelect),
		),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ style: "text-align: right;" },
				"Beats per bar:",
				br(),
				span({ style: "font-size: smaller; color: #888888;" }, "(Multiples of 3 or 4 are recommended)"),
			),
			this._beatsStepper,
		),
		div({ style: "display: flex; flex-direction: row; align-items: center; height: 2em; justify-content: flex-end;" },
			div({ class: "selectContainer", style: "width: 100%;" }, this._conversionStrategySelect),
		),
		div({ style: "display: flex; flex-direction: row-reverse; justify-content: space-between;" },
			this._okayButton,
		),
		this._cancelButton,
	);
		
	constructor(private _doc: SongDocument) {

		this._edoStepper.value = this._doc.song.edo + "";
		this._edoStepper.min = Config.edoMin + "";
		this._edoStepper.max = Config.edoMax + "";

		this._barsStepper.value = this._doc.song.barCount + "";
		this._barsStepper.min = Config.barCountMin + "";
		this._barsStepper.max = Config.barCountMax + "";

		this._beatsStepper.value = this._doc.song.beatsPerBar + "";
		this._beatsStepper.min = Config.beatsPerBarMin + "";
		this._beatsStepper.max = Config.beatsPerBarMax + "";

		const lastPosition: string | null = window.localStorage.getItem("barCountPosition");
		if (lastPosition != null) {
			this._positionSelect.value = lastPosition;
		}

		const lastStrategy: string | null = window.localStorage.getItem("beatCountStrategy");
		if (lastStrategy != null) {
			this._conversionStrategySelect.value = lastStrategy;
		}

		this._edoStepper.select();
		setTimeout(() => this._edoStepper.focus());

		this._barsStepper.select();
		setTimeout(() => this._barsStepper.focus());

		this._beatsStepper.select();
		setTimeout(() => this._beatsStepper.focus());

		this._okayButton.addEventListener("click", this._saveChanges);
		this._cancelButton.addEventListener("click", this._close);

		this._edoStepper.addEventListener("keypress", SongSettingsPrompt._validateKey);
		this._edoStepper.addEventListener("blur", SongSettingsPrompt._validateNumber);

		this._barsStepper.addEventListener("keypress", SongSettingsPrompt._validateKey);
		this._barsStepper.addEventListener("blur", SongSettingsPrompt._validateNumber);

		this._beatsStepper.addEventListener("keypress", SongSettingsPrompt._validateKey);
		this._beatsStepper.addEventListener("blur", SongSettingsPrompt._validateNumber);

		this.container.addEventListener("keydown", this._whenKeyPressed);
	}
		
		private _close = (): void => { 
		this._doc.undo();
	}
		
	public cleanUp = (): void => {
		this._okayButton.removeEventListener("click", this._saveChanges);
		this._cancelButton.removeEventListener("click", this._close);
		this._edoStepper.removeEventListener("keypress", SongSettingsPrompt._validateKey);
		this._edoStepper.removeEventListener("blur", SongSettingsPrompt._validateNumber);
		this._beatsStepper.removeEventListener("keypress", SongSettingsPrompt._validateKey);
		this._beatsStepper.removeEventListener("blur", SongSettingsPrompt._validateNumber);
		this._barsStepper.removeEventListener("keypress", SongSettingsPrompt._validateKey);
		this._barsStepper.removeEventListener("blur", SongSettingsPrompt._validateNumber);
		this.container.removeEventListener("keydown", this._whenKeyPressed);
	}
		
	private _whenKeyPressed = (event: KeyboardEvent): void => {
			if ((<Element> event.target).tagName != "BUTTON" && event.keyCode == 13) { // Enter key
			this._saveChanges();
		}
	}
		
	private static _validateKey(event: KeyboardEvent): boolean {
		const charCode = (event.which) ? event.which : event.keyCode;
		if (charCode != 46 && charCode > 31 && (charCode < 48 || charCode > 57)) {
			event.preventDefault();
			return true;
		}
		return false;
	}
		
	private static _validateNumber(event: Event): void {
		const input: HTMLInputElement = <HTMLInputElement>event.target;
		input.value = String(SongSettingsPrompt._validate(input));
	}
		
	private static _validate(input: HTMLInputElement): number {
		return Math.floor(Math.max(Number(input.min), Math.min(Number(input.max), Number(input.value))));
	}
		
	private _saveChanges = (): void => {
		window.localStorage.setItem("beatCountStrategy", this._conversionStrategySelect.value);
		window.localStorage.setItem("barCountPosition", this._positionSelect.value);
		const group: ChangeGroup = new ChangeGroup();
		group.append(new ChangeEdo(this._doc, SongSettingsPrompt._validate(this._edoStepper)));
		group.append(new ChangeBarCount(this._doc, SongSettingsPrompt._validate(this._barsStepper), this._positionSelect.value == "beginning"));
		group.append(new ChangeBeatsPerBar(this._doc, SongSettingsPrompt._validate(this._beatsStepper), this._conversionStrategySelect.value));
		this._doc.prompt = null;
		this._doc.record(group, true);
	}
}
