const merger = module.exports = {}

merger.merge = (schema) => {
	return ['allOf', 'anyOf', 'oneOf'].reduce((merged, key) => {
		if(!schema[key]){
			return merged
		}
		return schema[key].reduce((acc, item) => merger._mergeItem(acc, item), merged)
	}, {})
}

merger._mergeItem = (dst, src) => {
	Object.entries(src).forEach((entry) => {
		if(typeof dst[entry[0]] === 'undefined'){
			dst[entry[0]] = entry[1]
			return
		}

		if(dst[entry[0]] === src[entry[0]]){
			return
		}

		if(typeof entry[1] === 'object'){
			return merger._mergeItem(dst[entry[0]], entry[1])
		}

		//Convert type to an array if needed
		if(entry[0] === 'type'){
			const types = new Set([dst[entry[0]], entry[1]])
			if(types.size > 1){
				dst[entry[0]] = Array.from(types)
			}
			return
		}

		throw new Error(`Incompatible field: ${entry[0]}`)
	})
	return dst
}
