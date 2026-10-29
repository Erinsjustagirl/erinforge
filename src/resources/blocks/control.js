import javascriptGenerator from '../javascriptGenerator';
import { registerBlock, registerMutator } from '../register';
import Blockly from 'blockly/core';
import util from '../util';

const categoryPrefix = 'control_';
const categoryColor = '#fb6';

function register() {
    registerBlock(`${categoryPrefix}if`, {
        message0: 'if %1 then %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "BOOL0",
                "check": "Boolean"
            },
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS0"
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
        mutator: `${categoryPrefix}if_mutator`
    }, (block) => {
        const BOOL0 = javascriptGenerator.valueToCode(block, 'BOOL0') || "false";
        const BLOCKS0 = javascriptGenerator.statementToCode(block, 'BLOCKS0');

        let code = `if (${BOOL0}) { ${BLOCKS0} }`;

        for (let i = 1; block.getInput(`BOOL${i}`); i++) {
            const BOOLx = javascriptGenerator.valueToCode(block, `BOOL${i}`) || "false";
            const BLOCKSx = javascriptGenerator.statementToCode(block, `BLOCKS${i}`);

            code += ` else if (${BOOLx}) { ${BLOCKSx} }`;
        }

        if (block.getInput('ELSE')) {
            const ELSE = javascriptGenerator.statementToCode(block, 'ELSE');
            code += ` else { ${ELSE} }`;
        }

        code += ";"
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}if_mutator_if`, {
        message0: 'if',
        args0: [],
        nextStatement: null,
        inputsInline: true,
        enableContextMenu: false,
        colour: categoryColor,
    }, (block) => {})
    registerBlock(`${categoryPrefix}if_mutator_elseif`, {
        message0: 'else if',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {})
    registerBlock(`${categoryPrefix}if_mutator_else`, {
        message0: 'else',
        args0: [],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor,
    }, (block) => {})

    registerBlock(`${categoryPrefix}wait`, {
        message0: 'wait %1 seconds',
        args0: [
            {
                "type": "field_number",
                "name": "TIME",
                "check": "Number",
                "value": 10,
                "acceptsBlocks": true
            }
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const TIME = javascriptGenerator.valueToCode(block, 'TIME');
        const code = `await new Promise(resolve => setTimeout(() => resolve(), ${TIME} * 1000));`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}waitF`, {
        message0: 'wait until next frame',
        args0: [],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const v = "temp_"+util.randomHex(24)
        const code = `await new Promise(${v} => { requestAnimationFrame(() => { ${v}() }) })`;
        return `${code}\n`;
    })
    registerBlock(`${categoryPrefix}waitU`, {
        message0: 'wait until %1',
        args0: [
            {
                "type": "input_value",
                "name": "BOOL",
                "check": "Boolean"
            },
        ],
        previousStatement: null,
        nextStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BOOL = javascriptGenerator.valueToCode(block, 'BOOL');
        const v1 = "temp_"+util.randomHex(24)
        const v2 = "temp_"+util.randomHex(24)
        const code = `await new Promise(${v1} => {let ${v2} = () => false ? ${v1}() : requestAnimationFrame(${v2}); ${v2}()})`;
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}while`, {
        message0: 'while %1 do %2 %3',
        args0: [
            {
                "type": "input_value",
                "name": "BOOL",
                "check": "Boolean"
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
        const BOOL = javascriptGenerator.valueToCode(block, 'BOOL') || "false";
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `while (${BOOL}) { ${BLOCKS} };`
        return `${code}\n`;
    })
    
    registerBlock(`${categoryPrefix}for`, {
        message0: 'for %1 from %2 to %3 do %4 %5',
        args0: [
            {
                "type": "field_input",
                "name": "VAR",
                "text": "i"
            },
            {
                "type": "field_number",
                "name": "FROM",
                "check": "Number",
                "value": 0,
                "acceptsBlocks": true
            },
            {
                "type": "field_number",
                "name": "TO",
                "check": "Number",
                "value": 10,
                "acceptsBlocks": true
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
        const VAR = block.getFieldValue('VAR');
        const FROM = javascriptGenerator.valueToCode(block, 'FROM');
        const TO = javascriptGenerator.valueToCode(block, 'TO');
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `for (let ${VAR} = ${FROM}; ${VAR} <= ${TO}; ${VAR}++) { ${BLOCKS} };`
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}foriterator`, {
        message0: '%1',
        args0: [
            {
                "type": "field_input",
                "name": "VAR",
                "text": "i"
            }
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
            const VAR = block.getFieldValue('VAR');
            return [VAR, 0];
        })

    registerBlock(`${categoryPrefix}repeat`, {
        message0: 'repeat %1 %2 %3',
        args0: [
            {
                "type": "field_number",
                "name": "AMT",
                "check": "Number",
                "value": 10,
                "acceptsBlocks": true
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
        const AMT = javascriptGenerator.valueToCode(block, 'AMT');
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const varName = "temp_"+util.randomHex(24)
        const code = `for (var ${varName} = 0; ${varName} < ${AMT}; ${varName}++) { ${BLOCKS} };`
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}return`, {
        message0: 'return %1',
        args0: [
            {
                "type": "field_input",
                "name": "OUTPUT",
                "check": null,
                "text": "",
                "acceptsBlocks": true
            }
        ],
        previousStatement: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const OUTPUT = javascriptGenerator.valueToCode(block, 'OUTPUT');
        const code = `return ${OUTPUT};`
        return `${code}\n`;
    })

    registerBlock(`${categoryPrefix}inline`, {
        message0: 'inline %1 %2',
        args0: [
            {
                "type": "input_dummy"
            },
            {
                "type": "input_statement",
                "name": "BLOCKS"
            }
        ],
        output: null,
        inputsInline: true,
        colour: categoryColor
    }, (block) => {
        const BLOCKS = javascriptGenerator.statementToCode(block, 'BLOCKS');
        const code = `(async () => { ${BLOCKS} return null; })();`
        return [`${code}`, 0];
    })

    const control_if_mutator = {
        elseifCount_: 0,
        elseCount_: 0,

        mutationToDom: function () {
            if (!this.elseifCount_ && !this.elseCount_) {
                return null;
            }

            const container = Blockly.utils.xml.createElement('mutation');
            if (this.elseifCount_) {
              container.setAttribute('elseif', String(this.elseifCount_));
            }
            if (this.elseCount_) {
              container.setAttribute('else', '1');
            }
            return container;
        },

        domToMutation: function (xmlElement) {
            this.elseifCount_ = parseInt(xmlElement.getAttribute('elseif'));
            this.elseCount_ = parseInt(xmlElement.getAttribute('else'));
            this.rebuildShape_()
        },

        decompose: function (workspace) {
            const containerBlock = workspace.newBlock(`${categoryPrefix}if_mutator_if`);
            containerBlock.initSvg();
            let connection = containerBlock.nextConnection;

            for (let i = 1; i <= this.elseifCount_; i++) {
                const elseifBlock = workspace.newBlock(`${categoryPrefix}if_mutator_elseif`);
                elseifBlock.initSvg()
                connection.connect(elseifBlock.previousConnection);
                connection = elseifBlock.nextConnection;
            }

            if (this.elseCount_) {
                const elseBlock = workspace.newBlock(`${categoryPrefix}if_mutator_else`);
                elseBlock.initSvg()
                connection.connect(elseBlock.previousConnection);
            }

            return containerBlock
        },

        compose: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();

            this.elseifCount_ = 0;
            this.elseCount_ = 0;

            const valueConnections = [null]
            const statementConnections = [null]
            let elseStatementConnection = null

            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock()
                    continue;
                }

                switch (clauseBlock.type) {
                    case `${categoryPrefix}if_mutator_elseif`:
                        this.elseifCount_++;
                        valueConnections.push(clauseBlock.valueConnection_);
                        statementConnections.push(clauseBlock.statementConnection_);
                        break;
                    case `${categoryPrefix}if_mutator_else`:
                        this.elseCount_++;
                        elseStatementConnection = clauseBlock.statementConnection_;
                        break;
                }

                clauseBlock = clauseBlock.getNextBlock();
            }

            this.updateShape_()

            this.reconnectChildBlocks_(valueConnections, statementConnections, elseStatementConnection)
        },

        saveConnections: function (containerBlock) {
            let clauseBlock = containerBlock.nextConnection.targetBlock();
            let i = 1;
            while (clauseBlock) {
                if (clauseBlock.isInsertionMarker()) {
                    clauseBlock = clauseBlock.getNextBlock()
                    continue;
                }

                switch (clauseBlock.type) {
                    case `${categoryPrefix}if_mutator_elseif`:
                        const inputBool = this.getInput(`BOOL${i}`);
                        const inputStatement = this.getInput(`BLOCKS${i}`);
                        clauseBlock.valueConnection_ = inputBool && inputBool.connection.targetConnection;
                        clauseBlock.statementConnection_ = inputStatement && inputStatement.connection.targetConnection;
                        i++;
                        break;
                    case `${categoryPrefix}if_mutator_else`:
                        const elseStatement = this.getInput('ELSE');
                        clauseBlock.statementConnection_ = elseStatement && elseStatement.connection.targetConnection;
                        break;
                }

                clauseBlock = clauseBlock.getNextBlock();
            }
        },

        rebuildShape_: function () {
            const valueConnections = [null]
            const statementConnections = [null]
            let elseStatementConnection = null

            if (this.getInput('ELSE')) {
                elseStatementConnection = this.getInput('ELSE').connection.targetConnection;
            }

            for (let i = 1; this.getInput(`BOOL${i}`); i++) {
                valueConnections.push(this.getInput(`BOOL${i}`).connection.targetConnection);
                statementConnections.push(this.getInput(`BLOCKS${i}`).connection.targetConnection);
            }

            this.updateShape_()
            this.reconnectChildBlocks_(
                valueConnections,
                statementConnections,
                elseStatementConnection,
            );
        },

        updateShape_: function () {
            //remove all
            if (this.getInput('ELSE')) {
                this.removeInput('ELSE')
                this.removeInput('DUMMYELSE')
            }
            for (let i = 1; this.getInput(`BOOL${i}`); i++) {
                this.removeInput(`BOOL${i}`)
                this.removeInput(`BLOCKS${i}`)
                this.removeInput(`DUMMY${i}`)
            }

            //rebuild
            for (let i = 1; i <= this.elseifCount_; i++) {
                this.appendValueInput(`BOOL${i}`)
                    .setCheck('Boolean')
                    .appendField("else if")
                this.appendDummyInput(`DUMMY${i}`)
                    .appendField("then")
                this.appendStatementInput(`BLOCKS${i}`)
            }
            if (this.elseCount_) {
                this.appendDummyInput('DUMMYELSE')
                    .appendField("else")
                this.appendStatementInput('ELSE')
            }
        },
        reconnectChildBlocks_: function (
            valueConnections,
            statementConnections,
            elseStatementConnection,
        ) {
            for (let i = 1; i <= this.elseifCount_; i++) {
                Blockly.Mutator.reconnect(valueConnections[i], this, `BOOL${i}`)
                Blockly.Mutator.reconnect(statementConnections[i], this, `BLOCKS${i}`)
            }
            if (elseStatementConnection) {
                Blockly.Mutator.reconnect(elseStatementConnection, this, `ELSE`)
            }
        }
    }

    registerMutator(
        `${categoryPrefix}if_mutator`,
        control_if_mutator,
        null,
        [`${categoryPrefix}if_mutator_elseif`, `${categoryPrefix}if_mutator_else`],
    );
}

export default register;