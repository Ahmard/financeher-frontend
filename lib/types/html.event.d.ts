export interface HtmlEvent extends Event {
	target: HTMLElement;
	currentTarget: HTMLElement;
}

interface CustomHtmlEvent extends PointerEvent {
	target: HTMLElement; // Assuming the target is an HTML element
	buttons: number;
	clientX: number;
	clientY: number;
	layerX: number;
	layerY: number;
	altKey: boolean;
	bubbles: boolean;
	button: number;
	cancelBubble: boolean;
	cancelable: boolean;
	composed: boolean;
	ctrlKey: boolean;
	currentTarget: EventTarget | null;
	defaultPrevented: boolean;
	detail: number;
	eventPhase: number;
	explicitOriginalTarget: HTMLElement;
	height: number;
	isPrimary: boolean;
	isTrusted: boolean;
	metaKey: boolean;
	movementX: number;
	movementY: number;
	offsetX: number;
	offsetY: number;
	originalTarget: HTMLElement;
	pageX: number;
	pageY: number;
	pointerId: number;
	pointerType: string; // Typically "mouse", "pen", or "touch"
	pressure: number;
	relatedTarget: EventTarget | null;
	screenX: number;
	screenY: number;
	shiftKey: boolean;
	srcElement: HTMLElement;
	tangentialPressure: number;
	tiltX: number;
	tiltY: number;
	timeStamp: number;
	twist: number;
	view: Window;
	which: number;
	width: number;
	x: number;
	y: number;
}
