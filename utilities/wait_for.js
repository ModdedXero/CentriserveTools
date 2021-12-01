async function waitFor(conditionFunction) {

    const poll = async resolve => {
      if(await conditionFunction()) resolve();
      else setTimeout(_ => poll(resolve), 400);
    }
  
    return new Promise(poll);
}

module.exports = waitFor;