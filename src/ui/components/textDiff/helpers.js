let JsDiff = require('diff')

export const compareHandler = (oldContent, newContent) => {
  if(oldContent === '' || newContent === ''){ // both fields must be full
      return
  }

  let oldValue = "" 
  oldContent.ops.forEach(part => oldValue+=part.insert)

  let newValue = "" 
  newContent.ops.forEach(part => newValue+=part.insert)

  let delta = getCombined(oldValue, newValue) // get the combined values (without any styles)
  let thirdContent = oldContent.compose(delta); // apply the delta

  // add the styles from the new content object, without letting it delete characters
  let styleChanges = thirdContent.diff(newContent)
      styleChanges.ops.forEach(el => {
          if(el.hasOwnProperty('delete')){
              el.retain = el.delete
              delete el.delete
          }
      })

  thirdContent = thirdContent.compose(styleChanges); // apply styles

  let fourthChanges = thirdContent.diff(newContent); // now find the differences between the third content and the new one
  fourthChanges = indicateInsertsAndDeletion(fourthChanges) // update to indicate insertions and deletions
  let fourthContent = thirdContent.compose(fourthChanges) // create the fourth delta object

  
  let fifthChanges = oldContent.diff(thirdContent); // now find the differences between the third content and the old one
  fifthChanges = indicateInsertsAndDeletion(fifthChanges) // update to indicate insertions and deletions
  let fifthContent = oldContent.compose(fifthChanges) // create the fifth delta object
  
  // compare the fourth object and fifth one for final differences
  let finalChanges = fifthContent.diff(fourthContent)

  finalChanges.ops.forEach(op => {
      if (op.hasOwnProperty('attributes')) {
          if(op.attributes.background === null && op.attributes.color === null){ // retain the green color, indicating change
          op.attributes.background =  "#cce8cc"
          op.attributes.color= "#003700"
      }
  }})

  let finalContent = fifthContent.compose(finalChanges); // apply final changes
  
  return finalContent;

}

export const getCombined = (oldValue, newValue) => {
  // find the differences (not including style) and return as a delta object
  let diff = JsDiff.diffWords(oldValue, newValue, {
      ignoreCase: true,
      ignoreWhitespace: false, // show difference if extra white space is added
      newlineIsToken: true // new line should be considered a token
  })

  let combined = []
  diff.forEach(s => {
      if(s.added){
          combined.push({insert: s.value}) // label it as inserted
      }
      else{
          combined.push({retain: s.value.length}) // label it as retained
      }
  })

  let Delta = {
      ops : combined
  }

  return Delta

}

export const indicateInsertsAndDeletion = (delta) => {
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