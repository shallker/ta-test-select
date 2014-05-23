build: components index.js lib/*.js css/*.css
	@component build --copy -o build --name build
	@touch build/done
	@rm build/done
	@echo build done

components: component.json
	@component install --dev

clean:
	rm -fr build components template.js

.PHONY: clean
