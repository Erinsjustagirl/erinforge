import javascriptGenerator from '../javascriptGenerator';
import { registerBlock } from '../register';
import Blockly from 'blockly/core';

const categoryPrefix = 'events_';
const categoryColor = '#fc6';

function register() {
    registerBlock(`${categoryPrefix}loaded`, {
        message0: 'when extension loaded %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `(async () => { ${BLOCKS} })();`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}thread`, {
        message0: 'new thread %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `;(async () => { ${BLOCKS} })();`;
        return `${code}\n`;
    })

        registerBlock(`${categoryPrefix}datathread`, {
        message0: 'new thread with %1 as %2 %3 %4',
        args0: [
            {
                "type": "field_input",
                "name": "DATA",
                "check": null,
                "text": "",
                "acceptsBlocks": true
            },
            {
                type: "field_input",
                name: "NAME",
                text: "data",
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const DATA = javascriptGenerator.valueToCode(block, 'DATA') || 'null';
        const NAME = block.getFieldValue('NAME');
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `;(async (${NAME}) => { ${BLOCKS} })(${DATA});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}threaddata`, {
            message0: '%1',
            args0: [
                {
                    "type": "field_input",
                    "name": "NAME",
                    "text": "data"
                }
            ],
            output: null,
            inputsInline: true,
            colour: categoryColor
        }, (block) => {
                const NAME = block.getFieldValue('NAME');
                return [NAME, 0];
        })

    //broadcasts
    registerBlock(`${categoryPrefix}regbroadcast`, {
        message0: 'when %1 broadcasted %2 %3',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "broadcast1",
                "acceptsBlocks": true,
                "check": "String"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        inputsInline: true,
        order: 2,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `ExtForge.Broadcasts.register(${NAME}, (async () => { ${BLOCKS} })());`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}broadcast`, {
        message0: 'broadcast %1',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "broadcast1",
                "acceptsBlocks": true,
                "check": "String"
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `ExtForge.Broadcasts.execute(${NAME});`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}broadcastw`, {
        message0: 'broadcast %1 and wait',
        args0: [
            {
                "type": "field_input",
                "name": "NAME",
                "text": "broadcast1",
                "acceptsBlocks": true,
                "check": "String"
            }
        ],
        inputsInline: true,
        previousStatement: null,
        nextStatement: null,
        colour: categoryColor
    }, (block) => {
        const NAME = javascriptGenerator.valueToCode(block, 'NAME');
        const code = `await ExtForge.Broadcasts.execute(${NAME});`;
        return `${code}\n`;
    })
}

export default register;