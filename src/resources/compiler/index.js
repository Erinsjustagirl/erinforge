import javascriptGenerator from '../javascriptGenerator';
import util from '../util';

const start = `
if (!Scratch.extensions.unsandboxed) {
    alert("This extension needs to be unsandboxed to run!")
    return
}

const ExtForge = {
    Broadcasts: new function() {
        this.raw_ = {};
        this.register = (name, blocks) => {
            this.raw_[name] = blocks;
        };
        this.execute = async (name) => {
            if (this.raw_[name]) {
                await this.raw_[name]();
            };
        };
    },

    Variables: new function() {
        this.raw_ = {};
        this.set = (name, value) => {
            this.raw_[name] = value;
        };
        this.get = (name) => {
            return this.raw_[name] ?? null;
        }
    },

    Vector: class {
        constructor(x, y) {
            this.x = x;
            this.y = y;
        }

        static from(v) {
            if (v instanceof ExtForge.Vector) return v
            if (v instanceof Array) return new ExtForge.Vector(Number(v[0]), Number(v[1]))
            if (v instanceof Object) return new ExtForge.Vector(Number(v.x), Number(v.y))
            return new ExtForge.Vector()
        }

        add(v) {
            return new ExtForge.Vector(this.x + v.x, this.y + v.y);
        }

        set(x, y) {
            return new ExtForge.Vector(x ?? this.x, y ?? this.y)
        }
    },

    Utils: {
        setList: (list, index, value) => {
            [...list][index] = value;
            return list;
        },
        lists_foreach: {
            index: [0],
            value: [null],
            depth: 0
        },
        countString: (x, y) => {
            return y.length == 0 ? 0 : x.split(y).length - 1
        }
    }
}
`

class Compiler {
    /**
     * Generates JavaScript code from the provided workspace & info.
     * @param {import('blockly').Workspace} workspace 
     * @param {object} properties
     * @returns {string} Generated code.
     */
    compile(workspace, properties) {
        const code = javascriptGenerator.workspaceToCode(workspace);

        const headerCode = [
            `/*`,
            `   Created with ErinForge`,
            `   https://Erinsjustagirl.github.io/erinforge`,
            `   original at https://jwklong.github.io/extforge`,
            `*/`,
            `(async function (Scratch) {`,
            `const variables = {};`,
            ``,
            start
        ];
        const classRegistry = {
            top: [
                `class Extension {`
            ],
            extensionInfo: {},
            bottom: [
                `}`,
                ``,
                `let extension = new Extension();`,
                `// code compiled from erinforge`
            ]
        }
        const footerCode = [
            `Scratch.extensions.register(extension);`,
            `})(Scratch);`
        ];

        /** turbobuilder stuff need to port over
        if (imageStates) {
            if (imageStates.icon.image) {
                // add icon uri
                const url = imageStates.icon.image;
                classRegistry.extensionInfo.blockIconURI = url;
            }
            if (imageStates.menuicon.image) {
                // add icon uri
                const url = imageStates.menuicon.image;
                classRegistry.extensionInfo.menuIconURI = url;
            }
        }**/
        classRegistry.extensionInfo.id = properties.id;
        classRegistry.extensionInfo.name = properties.name;
        classRegistry.extensionInfo.color1 = properties.color;
        classRegistry.extensionInfo.blocks = Object.entries(window.blocks ?? {}).map(([id, block]) => {
            return {
                opcode: `block_${id}`,
                text: util.blockToExtensionText(block.fields),
                blockType: (block.type === "list" || block.type === "object") ? "reporter" : block.type,
                blockShape: block.type === "list" ? "__ARR_SHAPE__" : block.type === "object" ? "__OBJ_SHAPE__" : undefined,
                allowDropAnywhere: (block.type === "list" || block.type === "object") ? true : undefined,
                arguments: Object.fromEntries(block.fields.filter(v => v.type !== 'label').map(v => {
                    switch (v.type) {
                        case 'string': {
                            return [v.id, {
                                type: "string",
                                defaultValue: v.default
                            }]
                        }
                        case 'number': {
                            return [v.id, {
                                type: "number",
                                defaultValue: Number(v.default) || 0
                            }]
                        }
                        case 'boolean': {
                            return [v.id, {
                                type: "Boolean"
                            }]
                        }
                        case 'list': {
                            return [v.id, {
                                type: "array",
                                shape: "__ARR_SHAPE__"
                            }]
                        }
                        case 'object': {
                            return [v.id, {
                                type: "object",
                                shape: "__OBJ_SHAPE__"
                            }]
                        }
                    }
                })),
                hideFromPalette: block.hidden ? true : undefined
            }
        })

        const infoText = JSON.stringify(classRegistry.extensionInfo)
        .replaceAll('"__ARR_SHAPE__"', 'Scratch.BlockShape?.SQUARE')
        .replaceAll('"__OBJ_SHAPE__"', 'Scratch.extensions.isPenguinMod ? Scratch.BlockShape?.PLUS : Scratch.BlockShape?.ROUND')
        
        return [].concat(headerCode, classRegistry.top, [
            `getInfo() {`,
            `   return ${infoText.substring(0, infoText.length - 1)}}`,
            `}`,
        ], Object.entries(window.blocks ?? {}).map(([id, block]) => {
            let blockCode = javascriptGenerator.statementToCode(
                workspace.getTopBlocks().find(v => v.type == "blocks_define" && v.blockId_ == id),
                "BLOCKS"
            )
            const defaults = block.fields
                .filter(f => f.type === "list" || f.type === "object")
                .map(f => `args["${f.id}"] ??= ${f.type === "list" ? "[]" : "{}"};`)
                .join(" ")
            return `async block_${id}(args) { ${defaults} ${blockCode} }`
        }), classRegistry.bottom, code, footerCode).join('\n');
    }
}

export default Compiler;