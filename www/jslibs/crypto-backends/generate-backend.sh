#!/bin/bash

set -e

preprocess() {
	local IFS=''
	local line file
	while read line; do
		case "${line}" in
			"#INCLUDE "*)
				file="${line#\#INCLUDE }"
				echo "/* ${file} */"
				preprocess < "${file}"
				;;
			*) printf "%s\n" "${line}"
		esac
	done
}

case "$1" in
	*.backend.js) ;;
	*) echo "Call with a .backend.js file" >&2; exit 1 ;;
esac

tmpdir=$(mktemp --tmpdir -d generate-backend-XXXXXXX)
trap 'rm -rf "${tmpdir}"' EXIT

preprocess < "$1" > "${tmpdir}/source.js"

SHA1SUM=${SHA1SUM:-sha1sum}

csum=$("${SHA1SUM}" < "${tmpdir}/source.js")
csum=${csum%% *}

bname="${1%.backend.js}"
tmpbname="${tmpdir}/$(basename "${bname}")"

fname="${bname}-${csum}.js"
minname="${bname}-${csum}.min.js"

tmpfname="${tmpbname}-${csum}.js"
tmpminname="${tmpbname}-${csum}.min.js"

mv "${tmpdir}/source.js" "${tmpfname}"

yui-compressor "${tmpfname}" > "${tmpminname}"

mv "${tmpfname}" "${fname}"
mv "${tmpminname}" "${minname}"
