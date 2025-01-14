import * as XLSX from "xlsx";

interface Pipeline {
	begin(): void;
	process(): Promise<void>;
	end(): void;
}

class FormContent implements Pipeline {
	private app: string | number;

	constructor(app: string | number) {
		this.app = app;
	}
	begin(): void {}
	async process(): Promise<void> {
		const app = this.app;
		const { properties } = await kintone.api(
			kintone.api.url('/k/v1/form.json', true),
			'GET',
			{ app }
		);

		/* https://docs.sheetjs.com/docs/getting-started/examples/export */
		/* generate worksheet and workbook */
		const worksheet = XLSX.utils.json_to_sheet(properties);
		const workbook = XLSX.utils.book_new();
		XLSX.utils.book_append_sheet(workbook, worksheet, "sheetName");

		/* create an XLSX file and try to save to Form.xlsx */
		XLSX.writeFile(workbook, "Form.xlsx", { compression: true });
	}
	end(): void {}
}

class LayoutContent implements Pipeline {
	private app: string | number;

	constructor(app: string | number) {
		this.app = app;
	}
	begin(): void {}
	async process(): Promise<void> {
		const app = this.app;
		const { layout } = await kintone.api(
			kintone.api.url('/k/v1/app/form/layout.json', true),
			'GET',
			{ app }
		);
		console.dir(layout);
		writeThenDownload('layout.json', JSON.stringify(layout));
	}
	end(): void {}
}

class FieldContent implements Pipeline {
	private app: string | number;

	constructor(app: string | number) {
		this.app = app;
	}
	begin(): void {}
	async process(): Promise<void> {
		const app = this.app;
		const { properties } = await kintone.api(
			kintone.api.url('/k/v1/app/form/fields.json', true),
			'GET',
			{ app }
		);
		writeThenDownload('fields.json', JSON.stringify(properties));
	}
	end(): void {}
}

class EmptyContent implements Pipeline {
	begin(): void {}
	process(): Promise<void> {
		console.error('Not implemented');
		return Promise.resolve();
	}
	end(): void {}
}

export function ContentCreator (identifierId: number, { app }: { app: string | number}): Pipeline {
    switch (identifierId) {
        case 0:
            return new FormContent(app);
        case 1:
            return new LayoutContent(app);
        case 2:
            return new FieldContent(app);
        default:
            return new EmptyContent;
    }
}

function writeThenDownload(fname: string, payload: string): string {
	if (typeof Blob !== 'undefined') {
		var blob = new Blob([payload], { type: "application/json" });
		var url = URL.createObjectURL(blob);

		var a = document.createElement("a");
		if (a.download != null) {
			a.download = fname; a.href = url; document.body.appendChild(a); a.click();
			document.body.removeChild(a);
			if (URL.revokeObjectURL && typeof setTimeout !== 'undefined') setTimeout(function () { URL.revokeObjectURL(url); }, 60000);
			return url;
		}
	}
	throw new Error("cannot save file " + fname);
}