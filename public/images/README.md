# 이미지 넣는 위치

이 폴더는 청첩장 이미지를 넣는 위치입니다.

권장 파일명:

```txt
hero.jpg
og-image.jpg
gallery-01.jpg
gallery-02.jpg
gallery-03.jpg
gallery-04.jpg
gallery-05.jpg
gallery-06.jpg
```

- `hero.jpg`: 첫 화면 대표 사진입니다.
- `og-image.jpg`: 카카오톡/문자 공유 미리보기 이미지입니다.
- `gallery-*.jpg`: 갤러리 사진입니다.

파일명을 바꾸면 `src/data/wedding.ts`의 `images.hero`, `images.gallery`, `meta.ogImage` 경로도 함께 수정해야 합니다.

현재 포함된 JPG 파일은 배포 전 404를 방지하기 위한 기본 placeholder입니다. 실제 청첩장 배포 전에는 같은 파일명으로 실제 사진을 교체하는 것을 권장합니다.
