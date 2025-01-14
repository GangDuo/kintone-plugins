interface Pipeline {
	begin(): void;
	process(): void;
	end(): void;
}

class FormContent implements Pipeline {
	begin(): void {}
	process(): void {}
	end(): void {}
}

class LayoutContent implements Pipeline {
	begin(): void {}
	process(): void {}
	end(): void {}
}

class FieldContent implements Pipeline {
	begin(): void {}
	process(): void {}
	end(): void {}
}

class EmptyContent implements Pipeline {
	begin(): void {}
	process(): void {}
	end(): void {}
}

export function ContentCreator (identifierId: number): Pipeline {
    switch (identifierId) {
        case 0:
            return new FormContent;
        case 1:
            return new LayoutContent;
        case 2:
            return new FieldContent;
        default:
            return new EmptyContent;
    }
}