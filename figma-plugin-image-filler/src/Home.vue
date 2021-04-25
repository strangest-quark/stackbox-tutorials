<template>
  <div class="container">
    <b-container
      class="bv-example-row bv-example-row-flex-cols"
      align-self="center"
    >
      <b-row align-h="center">
        <b-col class="text-center" cols="12">
          <input
            class="fill-input"
            type="string"
            v-model="imageUrl"
            placeholder="Image url"
          />
        </b-col>
      </b-row>
      <br />

      <b-row align-h="center">
        <b-col class="text-center" cols="12">
          <b-button size="lg" class="fill-button" @click="fill">
            Fill
          </b-button>
        </b-col>
      </b-row>
    </b-container>
  </div>
</template>

<script>
export default {
  name: "home",
  data() {
    return {
      imageUrl: null,
    };
  },
  methods: {
    async fill() {
      var image;
      if (this.imageUrl != null) {
        const canvas = document.createElement("canvas");
        const ctx = canvas.getContext("2d");
        const art = new Image();
        art.crossOrigin = "Anonymous";
        art.src = this.imageUrl;
        await this.load(canvas, art, ctx);
        const imageData = ctx.getImageData(0, 0, art.width, art.height);
        const newBytes = await this.encode(canvas, ctx, imageData);
        image = newBytes;
      }
      const imageBytes = image;
      parent.postMessage(
        {
          pluginMessage: { type: "fill-image", imageBytes },
        },
        "*"
      );
    },
    async load(canvas, art, ctx) {
      return new Promise((resolve, reject) => {
        art.onload = async () => {
          canvas.width = art.width;
          canvas.height = art.height;
          ctx.drawImage(art, 0, 0);
          resolve(true);
        };
      });
    },
    async encode(canvas, ctx, imageData) {
      ctx.putImageData(imageData, 0, 0);
      return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
          const reader = new FileReader();
          reader.onload = () => resolve(new Uint8Array(reader.result));
          reader.onerror = () => reject(new Error("Could not read from blob"));
          reader.readAsArrayBuffer(blob);
        });
      });
    },
  },
};
</script>
<style scoped>
.container {
  margin-top: 40vh;
}
li {
  text-align: left;
  font-size: 0.9rem;
}
ol {
  margin-left: 10vw;
  margin-bottom: 7vh;
}
h5 {
  text-align: left;
  margin-left: 12vw;
  margin-bottom: 1vh;
}
</style>