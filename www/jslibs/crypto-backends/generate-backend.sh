#!/bin/bash

set -e

preprocess() {
	local IFS=''
	local line file
	while read -r line || [ "${line}" != "" ]; do
		case "${line}" in
			"#INCLUDE "*)
				file="${line#\#INCLUDE }"
				printf "%s\n" "/* ${file} */"
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

(cd "$(dirname "$1")"; preprocess ) < "$1" > "${tmpdir}/source.js"

SHA1SUM=${SHA1SUM:-sha1sum}

csum=$("${SHA1SUM}" < "${tmpdir}/source.js")
csum=${csum%% *}

bname="${1%.backend.js}"
tmpbname="$(basename "${bname}")"

fname="${bname}-${csum}.js"
minname="${bname}-${csum}.min.js"
mapname="${bname}-${csum}.js.map"

tmpfname="${tmpbname}-${csum}.js"
tmpminname="${tmpbname}-${csum}.min.js"
tmpmapname="${tmpbname}-${csum}.js.map"

mv "${tmpdir}/source.js" "${tmpdir}/${tmpfname}"

cp "${tmpdir}/${tmpfname}" "${fname}"

(cd "${tmpdir}"; uglifyjs -v --lint --source-map "${tmpmapname}" -o "${tmpminname}" "${tmpfname}")

echo "cleanup old files"
rm -f "${bname}"-*.{js,min.js,js.map}

mv "${tmpdir}/${tmpfname}" "${fname}"
mv "${tmpdir}/${tmpminname}" "${minname}"
mv "${tmpdir}/${tmpmapname}" "${mapname}"

echo "$(basename "${bname}-${csum}.min.js")"
