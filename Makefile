MODULE = bolt
VERSION = local
PROJECTS= \
	test \
	module \
	loader \
	kernel \
	inline \
	compiler
GEN = gen
DIST = ${GEN}/dist
TAR = ${DIST}/${MODULE}-${VERSION}.tar.gz
TAR_IMAGE = ${GEN}/image/${MODULE}-${VERSION}
VERSION_FILE = ${TAR_IMAGE}/bin/version
DIRECTORIES = ${GEN} ${GEN}/tmp ${DIST} ${TAR_IMAGE} ${TAR_IMAGE}/bin ${TAR_IMAGE}/command ${TAR_IMAGE}/lib ${INSTALLER}
MFLAGS = -s

.PHONY: clean dist projects

default: clean projects

dist: clean ${TAR}

${VERSION_FILE}: ${TAR_IMAGE}
	echo ${VERSION} > ${VERSION_FILE}

projects: ${DIST} ${TAR_IMAGE}/bin ${TAR_IMAGE}/command ${TAR_IMAGE}/lib ${VERSION_FILE}
	for x in ${PROJECTS}; do (cd $$x && ${MAKE} $(MFLAGS) test dist) && cp $$x/gen/* ${TAR_IMAGE}/lib/.; done
	cp script/bin/* ${TAR_IMAGE}/bin/.
	cp script/command/* ${TAR_IMAGE}/command/.
	mkdir ${TAR_IMAGE}/npm
	cp script/npm/* ${TAR_IMAGE}/npm/.
	cp config/npm/package.json README.md LICENSE.txt ${TAR_IMAGE}/

	mkdir ${TAR_IMAGE}/tasks
	cp script/grunt/grunt.js ${TAR_IMAGE}/tasks/bolt.js

${TAR}: projects
	cp LICENSE.txt README.md ${TAR_IMAGE}/.
	tar cfz ${TAR} -C ${GEN}/image .

${DIRECTORIES}:
	mkdir -p $@

publish:
ifeq ($(VERSION),local)
	@echo "No version supplied. Use 'make publish VERSION=<semver>'"
	@exit 1
else
	make clean projects
	npm publish ${TAR_IMAGE}
endif

clean:
	rm -rf ./${GEN}
	for x in ${PROJECTS}; do (cd $$x && ${MAKE} $(MFLAGS) clean); done
