import { ForwardRefExoticComponent } from 'react';
import { HTMLAttributes } from 'react';
import { ReactNode } from 'react';
import { RefAttributes } from 'react';

/** The colour behind an element: its nearest ancestor's that has one. */
export declare function backgroundOf(el: Element): string;

/** CSS cubic-bezier(), solved by halving as the Swift easing does. */
export declare function bezierEase(x1: number, y1: number, x2: number, y2: number): (x: number) => number;

/** Draws the element some other way. Whatever WebGL can read will do. */
export declare type CaptureFunction = (request: CaptureRequest) => TexImageSource | Promise<TexImageSource>;

/** What a custom capture is asked for. */
export declare interface CaptureRequest {
    /** The wave's element. */
    element: HTMLElement;
    /** Which of the two views to draw. */
    slot: "content" | "revealed";
    /** The area to draw — the element's padding box — in CSS pixels. */
    width: number;
    height: number;
    /** Backing pixels per CSS pixel: the picture should be
     `width × scale` by `height × scale`. */
    scale: number;
    /** The colour behind the element, for a picture with no holes. */
    background: string;
    /** True for elements to leave out: the wave's own canvas, and the view
     that is not being drawn. */
    ignore: (el: Element) => boolean;
}

export declare const COVER_ZONE = 60;

/** The tuned defaults for a type, as DistortionWaveStyle(type:). */
export declare function defaultStyle(type: WaveType): WaveStyle;

/**
 * A wave that leaves a button, an edge or a point and crosses the element,
 * bending what is there and carrying one view into another.
 *
 * ```tsx
 * <DistortionWave revealed={sent} revealedContent={<Receipt />}>
 *   <Review onSend={() => setSent(true)} />
 * </DistortionWave>
 * ```
 */
export declare const DistortionWave: ForwardRefExoticComponent<DistortionWaveProps & RefAttributes<DistortionWaveHandle>>;

export declare interface DistortionWaveHandle {
    /** Runs the wave from the start. */
    play(options?: PlayOptions): void;
    /** Runs it back to the first view. */
    reverse(): void;
    /** Straight back to the first view, with no wave. */
    reset(): void;
    /** Pictures the element now, so the next wave starts with its lens. */
    prepare(): Promise<void>;
    /** The wave's element. */
    readonly element: HTMLDivElement | null;
    /** The engine behind it, for benches. */
    readonly controller: WaveController | null;
}

export declare interface DistortionWaveProps extends WaveOptions, Omit<HTMLAttributes<HTMLDivElement>, keyof WaveOptions | "children"> {
    /** What the wave passes over: the view that shows first. Give it an
     opaque background, or one behind the whole element. */
    children?: ReactNode;
    /** The view the wave leaves behind it. Without one the wave passes over
     `children` and leaves them as they were. */
    revealedContent?: ReactNode;
    /** What stays above the wave, as it is: the button that starts it, a
     close control. The wave neither bends nor colours it, and it shows over
     both views. Its own children take clicks; the rest of it lets them
     through to the view below. */
    overlay?: ReactNode;
}

export declare interface DotBuffer {
    data: Float32Array;
    count: number;
}

/** Seconds for the whole of it, by when the swell has settled, the edges have
 cleared and the last dot has faded. */
export declare function duration(s: WaveStyle): number;

export declare interface FrameOptions {
    /** The least share of every pixel the canvas owns, 0–1. At 1 the canvas is
     the whole picture; at 0 it covers only what the wave changes. Defaults
     to 1 for an opaque renderer and 0 for one over a page. */
    floor?: number;
    /** Scales the lens and the blur, 0–1 — to ease them in when a screen
     arrives after the wave has started. Default 1. */
    gain?: number;
    /** Circular corners, as CSS draws them, rather than an iOS screen's
     continuous ones. Default false. */
    round?: boolean;
    /** One screen on both sides of the wave, whatever was given for the
     revealed one. Default false. */
    same?: boolean;
}

export declare interface Front {
    ox: number;
    oy: number;
    tilt: number;
    spine: number;
    radius: number;
    moved: number;
    squash: number;
    time: number;
    energy: number;
    swell: number;
    width: number;
    height: number;
    gravity: number;
    glow: number;
    clearRadius: number;
    hairClearRadius: number;
    rim: number;
    sparkle: number;
    flying: number;
    launched: boolean;
    hasCleared: boolean;
    ring: boolean;
    sideways: boolean;
    hold: number;
}

declare interface Geometry {
    /** The padding box, in CSS pixels before any ancestor's transform. */
    w: number;
    h: number;
    /** The border box and the left and top borders. */
    bw: number;
    bh: number;
    bl: number;
    bt: number;
    /** How much the ancestors scale the element. */
    anc: number;
    /** CSS pixels per point, and the area in points. */
    k: number;
    vw: number;
    vh: number;
    /** Canvas pixels per CSS pixel, and the canvas. */
    bs: number;
    W: number;
    H: number;
    /** The corner the edge colour follows, CSS pixels. */
    radius: number;
    /** The same as CSS for the canvas. */
    radii: string;
}

export declare function hexToRgb(hex: string): RGB;

/** The lumps on the edges (WaveRim.lumps): centre, length and depth of each,
 flattened, worked out once a frame. */
export declare const LUMPS = 7;

export declare function makeParticles(style: WaveStyle): Particle[];

/** A front to hand to `waveFront` as `out`, and keep for the next frame. */
export declare function newFront(): Front;

export declare interface Palette {
    colors: RGB[];
    /** The fringe riding ahead of the front. */
    ahead: RGB;
    /** The fringe trailing behind it. */
    behind: RGB;
}

/** A palette by name, one colour as `#RRGGBB`, or the colours themselves. */
export declare type PaletteLike = PaletteName | Palette | (string & {});

export declare type PaletteName = "colorful" | "green" | "ocean" | "sunset" | "mono";

export declare const PALETTES: Record<PaletteName, Palette>;

export declare interface Particle {
    index: number;
    column: number;
    heading: number;
    pace: number;
    drift: number;
    sway: number;
    swayRate: number;
    twinkleRate: number;
    phase: number;
    life: number;
    size: number;
    brightness: number;
    hop: number;
    hopOffset: number;
}

/** A particle's place and opacity at this point of the wave. Give `out` to
 have it filled in rather than a new spot made for every particle. */
export declare function particleAt(p: Particle, front: Front, source: Rect, style: WaveStyle, out?: Spot): Spot;

export declare interface PlayOptions {
    source?: SourceLike;
    focus?: Point | null;
}

export declare interface Point {
    x: number;
    y: number;
}

export declare interface Rect {
    x: number;
    y: number;
    w: number;
    h: number;
}

export declare interface RendererOptions {
    /** Draw over a page: the canvas stays clear wherever the wave leaves the
     pixels alone, so the DOM underneath shows through. Default false. */
    alpha?: boolean;
}

export declare type RGB = [number, number, number];

export declare function rgbToHex(c: RGB): string;

/** Fills and returns a shared buffer: read it before the next call. */
export declare function rimLumps(time: number, width: number, height: number, cornerRadius: number, pulse: number): Float32Array;

/** Which of the two screens a picture is for. */
export declare type ScreenSlot = "content" | "revealed";

/** One colour, lighter ahead of the front and deeper behind it (DistortionWavePalette.single). */
export declare function singlePalette(c: RGB): Palette;

export declare const smooth: (a: number, b: number, x: number) => number;

export declare interface Snapshot {
    canvas: HTMLCanvasElement;
    /** Milliseconds reading the tree, and loading and drawing the image. */
    walk: number;
    raster: number;
    nodes: number;
    /** Length of the SVG, in characters. */
    size: number;
}

/** A picture of `root` as it is now, `width × scale` by `height × scale`
 pixels, with the root's padding box at the origin. */
export declare function snapshot(root: HTMLElement, o: SnapshotOptions): Promise<Snapshot>;

export declare interface SnapshotOptions {
    width: number;
    height: number;
    scale: number;
    background: string;
    /** Elements to leave out, with all they hold. */
    skip?: (el: Element) => boolean;
    /** Declarations written over an element's computed ones. */
    force?: (el: Element) => Record<string, string> | undefined;
    /** A canvas to draw into, kept from the last picture. */
    into?: HTMLCanvasElement;
}

/** Where the wave starts: an element, a ref to one, or a rectangle in the
 wave element's own CSS pixels (from its padding box's corner). */
export declare type SourceLike = Element | {
    current: Element | null;
} | Rect | null | undefined;

/** A particle's place and opacity. */
export declare interface Spot {
    x: number;
    y: number;
    a: number;
}

export declare class WaveController {
    readonly root: HTMLElement;
    private a;
    private b;
    private opts;
    private first;
    private destroyed;
    private canvas;
    private renderer;
    /** No WebGL 2 here: crossfade instead. */
    private failed;
    private positioned;
    private geom;
    private geomDirty;
    /** Counts changes of geometry: a picture taken for another is dropped. */
    private epoch;
    private style;
    private styleDirty;
    private total;
    private particles;
    private particlesKey;
    private dots;
    private front;
    private probe;
    private spot;
    private frame;
    /** Where each frame puts a live canvas over its part of the picture. */
    private patch;
    /** This renderer has drawn its unseen first frame. */
    private primed;
    private slots;
    /** Views whose picture must land before the lens comes on, this run. */
    private waiting;
    /** Progress, 0–1 of the wave's duration. */
    private p;
    private run;
    private runAt;
    private raf;
    private scrubbing;
    /** This run is the plain crossfade. */
    private fading;
    /** How this run brings the second view in, once it has had to choose. */
    private mode;
    /** When the lens came on; −Infinity if it was there from the start. */
    private lensAt;
    private lastProp;
    private shown;
    /** Where this wave started, in the element's CSS pixels, then in points. */
    private srcEl;
    private srcCss;
    private focusCss;
    private src;
    private focus;
    /** A wave has gone out from here and not come back. */
    private held;
    private playOpts;
    private launchAt;
    private clearAt;
    private press;
    private pointerInside;
    private focusInside;
    private refreshTimer;
    private releaseTimer;
    private observer;
    private resizer;
    private abort;
    private still;
    private lastGain;
    private lastFloor;
    /** Milliseconds the last frame took to hand to the GPU. */
    private lastDraw;
    constructor(root: HTMLElement, content: HTMLElement, revealed?: HTMLElement | null);
    /** The options as they now stand. Cheap when nothing has changed: call it
     on every render. */
    update(next: WaveOptions): void;
    /** The second view's element, when it comes or goes. */
    setRevealedLayer(revealed: HTMLElement | null): void;
    /** Runs the wave from the start, whatever was showing. */
    play(options?: PlayOptions): void;
    /** Runs it back to the first view. */
    reverse(): void;
    /** Straight back to the first view, with no wave. */
    reset(): void;
    /** Takes the pictures now, so the next wave starts with its lens. */
    prepare(): Promise<void>;
    /** What the wave is doing, for a bench. */
    get debug(): {
        progress: number;
        running: boolean;
        mode: string | null;
        gain: number;
        floor: number;
        draw: number;
        clearAt: number;
        duration: number;
        geometry: Geometry | null;
        source: Rect;
        webgl: boolean;
        content: {
            ready: boolean;
            stale: boolean;
            busy: boolean;
            cost: number;
            walk: number;
            raster: number;
            nodes: number;
            size: number;
            count: number;
        };
        revealed: {
            ready: boolean;
            stale: boolean;
            busy: boolean;
            cost: number;
            walk: number;
            raster: number;
            nodes: number;
            size: number;
            count: number;
        };
    };
    destroy(): void;
    private measure;
    /** A viewport rectangle in the element's own CSS pixels. */
    private local;
    private restyle;
    /** Where the wave starts, read as it leaves. */
    private aim;
    /** The source in points, and the moments the run turns on. */
    private retime;
    private motionless;
    private needed;
    private fresh;
    private halt;
    private go;
    private tick;
    private paint;
    private invalidate;
    private finish;
    private scrubTo;
    /** One frame of the wave at `this.p`. */
    private draw;
    /** Copies each live canvas (`<canvas data-dw-live>`) in a view onto that
     view's screen, over the part of the picture it covers, so the wave
     bends it as it animates. The picture leaves these canvases out; each
     frame lays the canvas over that part of the picture again. */
    private patchLive;
    /** Keeps the pictures up with the element while the wave is out. */
    private chase;
    private animating;
    /** Which view the element shows: 0 the first, 1 the second, between them
     the second fading in over the first. */
    private show;
    private ensureRenderer;
    private dropRenderer;
    private capture;
    /** One frame nobody sees, once the pictures are in at rest, so that the
     first frame of the first wave does not wait on the GPU (see
     WaveRenderer.prime). Once for each renderer. */
    private prime;
    /** Makes the renderer and takes the first pictures, when the browser has
     a moment. */
    private warm;
    private refresh;
    /** At rest the pictures are kept up only while someone is near: a pointer
     over the element, or focus inside it. `eager` is for the rare changes
     worth a picture anyway: a new size, an image or a font arriving. */
    private scheduleRefresh;
    /** Nothing to do: keep the pictures fresh if someone is near, and let the
     GPU memory go if nobody is for a while. */
    private rest;
    /** Notes a change to what the pictures show. False when the change is in
     something the pictures leave out, such as the overlay. */
    private mark;
    private onMutations;
    /** Counts the changes the observer has not yet reported. */
    private flush;
    private onResize;
    private listen;
}

/** Where the wave is at `progress`, 0–1 of its duration (WaveFront.init).
 Give `out` to have it filled in rather than a new front made: a frame
 loop keeps one, and leaves the collector nothing to pick up. */
export declare function waveFront(progress: number, source: Rect, width: number, height: number, style: WaveStyle, focus?: Point | null, out?: Front): Front;

export declare interface WaveOptions {
    /** Which view shows. Changing it runs the wave: forwards to reveal,
     backwards, faster and eased, to return. Leave it out to drive the wave
     with `play()` alone. */
    revealed?: boolean;
    /** The shape of the front. Default "vertical". */
    type?: WaveType;
    /** Where the wave starts. Read when a wave leaves from rest. Default: the
     button, link or field last pressed inside the element, else the focused
     one, else a place that suits the type. */
    source?: SourceLike;
    /** The point of the touch, in the element's CSS pixels: the front leans
     toward it. Default: the last press, when it landed on the source. */
    focus?: Point | null;
    /** Numbers to change, over the type's defaults. */
    waveStyle?: WaveStyleInput;
    /** The colours. Default: the type's own. */
    palette?: PaletteLike;
    /** CSS pixels per point. "auto" (default) sizes the wave to the element;
     1 keeps every length as written. */
    scale?: number | "auto";
    /** The radius the edge colour follows, in CSS pixels. Default: the
     element's own border radius. */
    cornerRadius?: number;
    /** Holds the wave at this point of its run, 0–1, instead of playing. */
    scrub?: number | null;
    /** How the element is pictured for the lens. `false` draws the colour
     alone; a function replaces the built-in capture. Default true. */
    capture?: boolean | CaptureFunction;
    /** Whether the picture follows the element while the wave is out: `true`
     (default) after it changes, "animations" also while CSS animations
     run, `false` never. */
    live?: boolean | "animations";
    /** Take the first picture when the browser is next idle after mounting,
     so the first wave has its lens from the start. Default true. */
    prewarm?: boolean;
    /** Canvas pixels per CSS pixel. Default: the display's. */
    resolution?: number;
    /** "system" (default) follows the visitor's reduced-motion setting and
     crossfades instead. */
    reducedMotion?: "system" | "always" | "never";
    /** Called when a wave ends, with the view now showing. Not called for a
     wave that was turned around before it got there. */
    onFinish?: (revealed: boolean) => void;
}

export declare class WaveRenderer {
    private canvas;
    private gl;
    private quad;
    private dots;
    private main;
    private blur;
    private copy;
    private dot;
    private screens;
    private blank;
    private sizePt;
    private farBlur;
    private field;
    private dotsSize;
    private pal;
    private palKey;
    private ahead;
    private behind;
    private alpha;
    readonly ok: boolean;
    constructor(canvas: HTMLCanvasElement, options?: RendererOptions);
    /** True once the browser has taken the context away; make a new renderer
     on the canvas when `webglcontextrestored` fires. */
    get lost(): boolean;
    /** The largest picture a screen can hold, per side, in pixels. */
    get maxTextureSize(): number;
    /** Whether a screen has been given for this slot. */
    has(which: ScreenSlot): boolean;
    private texture;
    private target;
    private drop;
    private quadDraw;
    /** A blurred copy of `sharp` into `into` (made, or remade at a new size):
     downsampled so the kernel stays short, then blurred along x and y.
     `sigmaPt` is the blur radius in points. */
    private blurred;
    /** A scratch target per size, kept for the next blur. */
    private scratches;
    private scratch;
    /** A screen — any picture WebGL can read, drawn at the backing resolution —
     with its blurred copies. `widthPt` × `heightPt` is the wave's area.

     With only the content given, both sides of the wave show it, as both
     sides of the app's wave show the same morphing view; give the revealed
     screen too and the wave carries one into the other. Called again while
     a screen changes: the textures are refilled in place. */
    setScreen(source: TexImageSource, widthPt: number, heightPt: number, blurPt: number, which?: ScreenSlot): void;
    /** The wave's area in points, where no screen has said it: a renderer
     over a page can draw the colour alone. */
    setSize(widthPt: number, heightPt: number): void;
    /** Lets a screen go: the revealed one, to go back to one screen on both
     sides, or the content, to draw the colour alone. */
    clearScreen(which: ScreenSlot): void;
    private dropScreen;
    /** Writes `source` over part of a screen, its top left corner at pixel
     (x, y): a part of the element that changes while the wave is out, such
     as a canvas animating under it. Call `reblur` once the frame's patches
     are in, so the blurred copies carry them too. */
    patchScreen(which: ScreenSlot, source: TexImageSource, x: number, y: number): void;
    /** Remakes a screen's blurred copies from its sharp one, after patches. */
    reblur(which: ScreenSlot): void;
    /** Remake the far copies when the style's blur radius moves. */
    setBlur(blurPt: number): void;
    /** Empties the canvas: over a page, the page alone shows. */
    clear(): void;
    /** A single clear texel, bound where a screen is missing. */
    private blankTexture;
    /** One frame. `front` null draws the content at rest — or, over a page,
     nothing: the page is the picture.

     Without a content screen an opaque renderer has nothing to draw; one
     over a page draws the colour, the rim and the dots alone. */
    render(front: Front | null, style: WaveStyle, lumps: Float32Array, dots: DotBuffer | null, options?: FrameOptions): void;
    /** Draws a frame nobody sees. A driver puts off the last of the work on a
     program until it first draws with it, and that would otherwise land in
     the first frame of the first wave. Call it with the screens in, at
     rest: the canvas is left clear. */
    prime(front: Front, style: WaveStyle, lumps: Float32Array, dots: DotBuffer | null, options?: FrameOptions): void;
    dispose(): void;
}

export declare interface WaveStyle {
    type: WaveType;
    anticipation: number;
    travel: number;
    launchGap: number;
    linger: number;
    rimFade: number;
    returnSpeed: number;
    /** The front's travel curve, as CSS cubic-bezier(easeX1, easeY1, easeX2,
     easeY2). Left out, it is (0.22, 1, 0.36, 1). */
    easeX1?: number;
    easeY1?: number;
    easeX2?: number;
    easeY2?: number;
    pull: number;
    inhale: number;
    gatherGlow: number;
    gatherDots: number;
    amplitude: number;
    lensWidth: number;
    aberration: number;
    swell: number;
    blur: number;
    blurAhead: number;
    blurBehind: number;
    lead: number;
    tail: number;
    strength: number;
    rimWidth: number;
    rimUnevenness: number;
    rimStrength: number;
    rimSoftness: number;
    cornerRadius: number;
    rimPulse: number;
    hairlineWidth: number;
    hairlineOpacity: number;
    hairlineWhite: number;
    hairlineLinger: number;
    hairlineFade: number;
    orientation: number;
    particleCount: number;
    particleSize: number;
    particleReach: number;
    particleFlight: number;
    particleGap: number;
    particleLife: number;
    particleSpread: number;
    palette: Palette;
}

/** Any of the wave's numbers, over the defaults for its type. Lengths are in
 points: they grow with `scale`. */
export declare type WaveStyleInput = Partial<Omit<WaveStyle, "type" | "palette" | "cornerRadius">> & {
    palette?: PaletteLike;
};

export declare type WaveType = "vertical" | "horizontal" | "center";

export { }
