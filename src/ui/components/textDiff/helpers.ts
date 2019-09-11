let JsDiff = require('diff')
import { DeltaStatic, DeltaOperation } from "quill";

export const compareHandler = (oldContent: DeltaStatic, newContent: DeltaStatic) => {
    if (oldContent == null || newContent == null) {
        return;
    }
    if (oldContent.ops == null || newContent.ops == null) {
        return;
    }

    let oldValue = ""
    oldContent.ops.forEach(part => oldValue += part.insert)

    let newValue = ""
    newContent.ops.forEach(part => newValue += part.insert)

    let delta = getCombined(oldValue, newValue) // get the combined values (without any styles)
    let thirdContent = oldContent.compose(delta as DeltaStatic); // apply the delta

    // add the styles from the new content object, without letting it delete characters
    let styleChanges = thirdContent.diff(newContent)
    styleChanges.ops && styleChanges.ops.forEach(el => {
        if (el.hasOwnProperty('delete')) {
            el.retain = el.delete
            delete el.delete
        }
    })

    thirdContent = thirdContent.compose(styleChanges); // apply styles

    const fourthChangesDiff = thirdContent.diff(newContent); // now find the differences between the third content and the new one
    const fourthChangesIndication = indicateInsertsAndDeletion(fourthChangesDiff) // update to indicate insertions and deletions
    if (!fourthChangesIndication) {
        return;
    }
    const fourthContent = thirdContent.compose(fourthChangesIndication) // create the fourth delta object


    const fifthChangesDiff = oldContent.diff(thirdContent); // now find the differences between the third content and the old one
    const fifthChangesIndication = indicateInsertsAndDeletion(fifthChangesDiff) // update to indicate insertions and deletions
    if (!fifthChangesIndication) {
        return;
    }
    let fifthContent = oldContent.compose(fifthChangesIndication) // create the fifth delta object

    // compare the fourth object and fifth one for final differences
    let finalChanges = fifthContent.diff(fourthContent)

    finalChanges.ops && finalChanges.ops.forEach(op => {
        if (op.hasOwnProperty('attributes')) {
            if (op.attributes && op.attributes.background === null && op.attributes.color === null) { // retain the green color, indicating change
                op.attributes.background = "#cce8cc"
                op.attributes.color = "#003700"
            }
        }
    })

    let finalContent = fifthContent.compose(finalChanges); // apply final changes

    return finalContent;

}

const getCombined = (oldValue: string, newValue: string): Partial<DeltaStatic> => {
    // find the differences (not including style) and return as a delta object
    let diff = JsDiff.diffWords(oldValue, newValue, {
        ignoreCase: true,
        ignoreWhitespace: false, // show difference if extra white space is added
        newlineIsToken: true // new line should be considered a token
    })

    let combined: DeltaOperation[] = []
    diff.forEach((s: any) => {
        if (s.added) {
            combined.push({ insert: s.value }) // label it as inserted
        }
        else {
            combined.push({ retain: s.value.length }) // label it as retained
        }
    })

    let Delta: Partial<DeltaStatic> = {
        ops: combined
    }

    return Delta
}

const indicateInsertsAndDeletion = (delta: DeltaStatic) => {
    if (!delta.ops) {
        return;
    }

    for (var i = 0; i < delta.ops.length; i++) {
        let op = delta.ops[i];

        // if the change was an insertion or a difference in attributes
        if (op.hasOwnProperty('attributes') || op.hasOwnProperty('insert')) {
            // color it green
            op.attributes = {
                background: "#cce8cc",
                color: "#003700"
            };
        }

        // if the change was a deletion 
        if (op.hasOwnProperty('delete')) {
            // keep the text
            op.retain = op.delete;
            delete op.delete;
            // but color it red and struckthrough
            op.attributes = {
                background: "#e8cccc",
                color: "#370000",
                strike: true
            };
        }
    }
    return delta
}