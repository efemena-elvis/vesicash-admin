<template>
  <div class="profile-container">
    <div class="meta-container">
      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">FIRST NAME</div>
        <div class="secondary-2-text mgb-10">DORSEY</div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">LAST NAME</div>
        <div class="secondary-2-text mgb-10">NELSON</div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">DATE CREATED</div>
        <div class="secondary-2-text mgb-10">3rd July, 1990</div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">WEBSITE</div>
        <div class="secondary-2-text mgb-10">www.my-business-website.com</div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">OFFICE ADDRESS</div>
        <div class="secondary-2-text mgb-10">8, Office address, Lagos</div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">PHONE NUMBER</div>
        <div class="d-flex align-items-start">
          <div class="secondary-2-text mgb-10 mgr-8">08066741309</div>
          <TagCard card_text="Verified" />
        </div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">EMAIL ADDRESS</div>
        <div class="d-flex align-items-start">
          <div class="secondary-2-text mgb-10 mgr-8">mattycash@qa.team</div>
          <TagCard card_text="Pending" card_type="progress" />
        </div>
      </div>

      <div class="meta-block">
        <div class="grey-600 tertiary-3-text mgb-7">BIO</div>

        <div
          class="secondary-2-text mgb-10 mgr-8"
        >Here is the bio for the business named the Candy studio. More info to follow soon.</div>
      </div>
    </div>

    <button class="btn btn-md btn-alert">Delete account</button>
  </div>
</template>

<script>
import TagCard from "@/shared/components/card-comps/tag-card";
export default {
  name: "UserProfile",

  components: {
    TagCard,
  },
};
</script>

<style lang="scss" scoped>
.profile-container {
  padding: toRem(40) 0 toRem(100) 0;

  .meta-container {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
    gap: toRem(40) toRem(20);
    margin-bottom: toRem(70);
  }
}
</style>