<template>
  <div class="naira-dollar-metric-card rounded-8 teal-900-bg" :class="[ escrow && 'green-100-bg' ]">
    <div class="w-100 secondary-3-text grey-300 mgb-15" :class="[ escrow && 'neutral-300' ]">
      {{
      escrow ? 'ESCROW BALANCE':'WALLET BALANCE'
      }}
    </div>
    <!-- TOP ROW -->
    <div class="top-row mgb-16">
      <!-- WALLET COLUMN SECTION -->
      <template v-for="(wallet, index) in wallet_balance">
        <div class="column" :class="[escrow && 'escrow-borders' ]" :key="index">
          <!-- LOADING AMOUNT VALUE -->
          <template v-if="loading_wallet">
            <div class="loading-amount-value rounded-1 skeleton-loader mgb-5"></div>
          </template>

          <template v-else>
            <!-- AMOUNT VALUE -->
            <div
              class="amount-value secondary-1-text mgb-4"
              :class="[
                escrow && 'teal-800',
                ['naira','NGN'].includes(wallet.sign) && !escrow && 'text-white',
                ['dollar','USD'].includes(wallet.sign) && !escrow && 'green-400',
                ['pound','GBP'].includes(wallet.sign) && !escrow && 'teal-500',
               
              ]"
            >
              <span>{{ $money.getSign(wallet.sign)}}{{$money.addComma(wallet.value.split(".")[0])}}</span>
              <span class="amount-zero">.{{wallet.value.split(".")[1]||"00" }}</span>
            </div>
          </template>

          <!-- TITLE DESCRIPTION -->
          <div
            class="title-description secondary-3-text grey-300 mgt-8"
            :class="[ escrow && 'neutral-300' ]"
          >{{ wallet.description }}</div>
        </div>
      </template>
    </div>
  </div>
</template>

<script>
export default {
  name: "UserBalanceCard",

  props: {
    wallet_balance: {
      type: Array,
      default: () => [],
    },

    loading_wallet: {
      type: Boolean,
      default: true,
    },

    escrow: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style lang="scss" scoped>
.naira-dollar-metric-card {
  padding: toRem(18) toRem(18) toRem(10);
  width: toRem(525);

  @include breakpoint-custom-down(530) {
    padding: toRem(20);
    width: 100%;
  }

  .top-row {
    @include flex-row-start-nowrap;

    @include breakpoint-custom-down(530) {
      @include flex-row-start-wrap;
    }

    .column {
      width: 33.3%;

      @include breakpoint-custom-down(530) {
        width: 100%;
      }

      .title-text {
        @include breakpoint-down(xs) {
          font-size: toRem(11.75);
        }
      }

      .amount-value {
        font-size: toRem(18.5);

        @include breakpoint-down(lg) {
          @include generate-font-type("primary-1");
          font-size: toRem(16.5);
        }

        @include breakpoint-custom-down(700) {
          font-size: toRem(15);
        }

        .amount-zero {
          font-size: toRem(16);

          @include breakpoint-custom-down(700) {
            font-size: toRem(14);
          }
        }
      }

      .loading-amount-value {
        @include draw-shape(120, 30);
      }

      border-right: toRem(1) solid getColor("teal-800");
      padding: 0 toRem(24);

      @include breakpoint-custom-down(530) {
        border: 0;
        padding: toRem(16) 0;
        border-bottom: toRem(1) solid getColor("teal-800");
      }

      &:first-of-type {
        padding-left: 0;

        @include breakpoint-custom-down(530) {
          padding-top: 0;
        }
      }

      &:last-of-type {
        border-right: none;
        border-bottom: none;
      }
    }

    .escrow-borders {
      border-color: getColor("grey-300");
    }
  }
}
</style>
