export interface Stylesheet {
    type: 'stylesheet';
    stylesheet: {
        rules: Array<Supports | Media | Keyframes | Rule | Comment>;
    };
}
export interface Media {
    type: 'media';
    media: string;
    rules: Array<Supports | Media | Keyframes | Rule | Comment>;
}
export interface Supports {
    type: 'supports';
    supports: string;
    rules: Array<Supports | Media | Keyframes | Rule | Comment>;
}
export interface Keyframes {
    type: 'keyframes';
    name: string;
    keyframes: Array<Keyframe | Comment>;
}
export interface Keyframe {
    type: 'keyframe';
    values: string[];
    declarations: Array<Declaration | Comment>;
}
export interface Rule {
    type: 'rule' | 'page';
    selectors: string[];
    declarations: Array<Declaration | Comment>;
}
export interface Declaration {
    type: 'declaration';
    property: string;
    value: string;
}
export interface Comment {
    type: 'comment';
}
