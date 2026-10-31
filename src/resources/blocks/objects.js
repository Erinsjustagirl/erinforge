import javascriptGenerator from '../javascriptGenerator';
import { registerBlock, registerMutator } from '../register';
import Blockly from 'blockly/core';
import util from '../util';

const categoryPrefix = 'objects_';
const categoryColor = '#f6c';

function register() {
    registerBlock(`${categoryPrefix}parse`, {
        message0: 'parse %1',
        args0: [
            {
                "type": "field_input",
                "name": "TEXT",
                "check": "String",
                "text": "{\"foo\": \"bar\"}",
                "acceptsBlocks": true,
            }
        ],
        output: "Object",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT');
        return [`(() => { try { return JSON.parse(${TEXT}); } catch { return null; } })()`, 0];
    })

    registerBlock(`${categoryPrefix}stringify`, {
        message0: 'stringify %1',
        args0: [
            {
                "type": "input_value",
                "name": "OBJ",
                "acceptsBlocks": true,
                "check": "Object"
            }
        ],
        output: "String",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const OBJ = javascriptGenerator.valueToCode(block, 'OBJ');
        return [`JSON.stringify(${OBJ})`, 0];
    })

    registerBlock(`${categoryPrefix}get`, {
        message0: 'get %1 of %2',
        args0: [
            {
                "type": "field_input",
                "name": "PROPERTY",
                "check": "String",
                "text": "foo",
                "acceptsBlocks": true
            },
            {
                "type": "input_value",
                "name": "OBJ",
                "acceptsBlocks": true,
                "check": "Object"
            }
        ],
        output: "Object",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const PROPERTY = javascriptGenerator.valueToCode(block, 'PROPERTY');
        const OBJ = javascriptGenerator.valueToCode(block, 'OBJ');
        return [`(${OBJ}[${PROPERTY}] ?? null)`, 0];
    })

    registerBlock(`${categoryPrefix}set`, {
        message0: 'set %1 of %2 to %3',
        args0: [
            {
                "type": "field_input",
                "name": "PROPERTY",
                "check": "String",
                "text": "foo",
                "acceptsBlocks": true
            },
            {
                "type": "input_value",
                "name": "OBJ",
                "acceptsBlocks": true,
                "check": "Object"
            },
            {
                "type": "field_input",
                "name": "VALUE",
                "check": null,
                "text": "bar",
                "acceptsBlocks": true
            }
        ],
        output: "Object",
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const PROPERTY = javascriptGenerator.valueToCode(block, 'PROPERTY');
        const OBJ = javascriptGenerator.valueToCode(block, 'OBJ');
        const VALUE = javascriptGenerator.valueToCode(block, 'VALUE');
        return [`(() => { ${OBJ}[${PROPERTY}] = ${VALUE}; return ${OBJ}; })()`, 0];
    })
}

export default register;