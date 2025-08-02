export class FileExtHelper {
	private knownExts: Set<string>;

	private static DEFAULT_EXTENSIONS = [
		'tar.gz',
		'tar.bz2',
		'tar.xz',
		'tar.zst',
		'tar.lz',
		'tar.lzma',
		'tar.lzo',
		'tar.sz',
		'tar.br',
		'tar.Z',
		'tbz2',
		'tgz',
		'txz',
		'tlz',
		'tzst',
		'tbr',
		'zip',
		'zip.gpg',
		'zip.aes',
		'7z',
		'7z.001',
		'7z.gpg',
		'gz',
		'bz2',
		'xz',
		'zst',
		'lz',
		'lzma',
		'lzo',
		'sz',
		'br',
	];

	constructor(knownExts?: string[]) {
		this.knownExts = new Set(knownExts || FileExtHelper.DEFAULT_EXTENSIONS);
	}

	static withCustomExtensions(extensions: string[]): FileExtHelper {
		return new FileExtHelper(extensions);
	}

	static withAdditionalExtensions(extensions: string[]): FileExtHelper {
		const handler = new FileExtHelper();
		handler.addExtensions(extensions);
		return handler;
	}

	addExtension(ext: string): void {
		this.knownExts.add(ext);
	}

	addExtensions(extensions: string[]): void {
		// biome-ignore lint/complexity/noForEach: <explanation>
		extensions.forEach((ext) => this.knownExts.add(ext));
	}

	removeKnownExtension(ext: string): boolean {
		return this.knownExts.delete(ext);
	}

	getExtensions(): string[] {
		return Array.from(this.knownExts).sort();
	}

	isKnownExtension(ext: string): boolean {
		return this.knownExts.has(ext);
	}

	clearExtensions(): void {
		this.knownExts.clear();
	}

	getExtension(filename: string): string | null {
		const localFilename = filename.trim();
		if (!localFilename || localFilename === '.' || localFilename === '..')
			return null;

		const sortedExts = Array.from(this.knownExts).sort(
			(a, b) => b.length - a.length,
		);
		const lowerFilename = localFilename.toLowerCase();

		for (const ext of sortedExts) {
			if (lowerFilename.endsWith(`.${ext}`)) {
				return `.${ext}`;
			}
		}

		const dotPos = localFilename.lastIndexOf('.');
		if (dotPos > 0 && dotPos < localFilename.length - 1) {
			return localFilename.slice(dotPos);
		}
		return null;
	}

	removeExtension(filename: string): string {
		const localFilename = filename.trim();
		if (!localFilename || localFilename === '.' || localFilename === '..')
			return localFilename;

		const sortedExts = Array.from(this.knownExts).sort(
			(a, b) => b.length - a.length,
		);
		const lowerFilename = localFilename.toLowerCase();

		for (const ext of sortedExts) {
			const fullExt = `.${ext}`;
			if (lowerFilename.endsWith(fullExt)) {
				return localFilename.slice(0, -fullExt.length);
			}
		}

		const dotPos = localFilename.lastIndexOf('.');
		if (dotPos > 0 && dotPos < localFilename.length - 1) {
			return localFilename.slice(0, dotPos);
		}
		return localFilename;
	}

	splitFilename(filename: string): [string, string | null] {
		const base = this.removeExtension(filename);
		const ext = this.getExtension(filename);
		return [base, ext];
	}
}
