<!--
 * @Author: your name
 * @Date: 2020-08-11 11:46:27
 * @LastEditTime: 2020-08-11 13:34:10
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \backstage\src\components\t.vue
-->
<script>
  export default {
    props: {
      name: {
        require: true,
      }
    },
    render(createElement) {
      let self = this
      return createElement('input', {
        // domProps: {
        //   value: self.name
        // },
        // on: {
        //   input(event) {
        //     console.log(event.target.value);
        //     self.$emit('input', event.target.value)
        //   }
        // }
      })
    }
  };
</script>
 