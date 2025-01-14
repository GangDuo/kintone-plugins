interface Pipeline {
	begin(): void;
	process(): void;
	end(): void;
}

class FormContent implements Pipeline {
	private app: string | number;

	constructor(app: string | number) {
		this.app = app;
	}
	begin(): void {}
	process(): void {}
	end(): void {}
}

class LayoutContent implements Pipeline {
	private app: string | number;

	constructor(app: string | number) {
		this.app = app;
	}
	begin(): void {}
	process(): void {}
	end(): void {}
}

class FieldContent implements Pipeline {
	private app: string | number;

	constructor(app: string | number) {
		this.app = app;
	}
	begin(): void {}
	process(): void {}
	end(): void {}
}

class EmptyContent implements Pipeline {
	begin(): void {}
	process(): void {}
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