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
                "text": "{}",
                "acceptsBlocks": true,
            }
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TEXT = javascriptGenerator.valueToCode(block, 'TEXT');
        return [`(() => { try { return JSON.parse(${TEXT}); } catch { return null; } })()`, 0];
    })
}

export default register;