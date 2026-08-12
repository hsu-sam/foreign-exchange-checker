<script setup lang="ts">
import AmountInput from "../ui/AmountInput.vue";
import Button from "../ui/Button.vue";
import CurrencyPicker from "../ui/CurrencyPicker.vue";

const sendCurrency = ref("USD");
const receiveCurrency = ref("EUR");
const sendAmount = ref("");

const { rate, status, error } = useExchangeRate(sendCurrency, receiveCurrency);

const receiveAmount = computed(() => {
  const amount = Number.parseFloat(sendAmount.value);
  if (!sendAmount.value || Number.isNaN(amount) || rate.value == null)
    return "";

  return (amount * rate.value).toFixed(4);
});

const receiveAmountModel = computed({
  get: () => receiveAmount.value,
  set: () => {},
});

const rateLabel = computed(() => {
  if (status.value === "pending" || (rate.value == null && !error.value)) {
    return "Loading rate…";
  }
  if (error.value || rate.value == null) return "Rate unavailable";

  return `1 ${sendCurrency.value} = ${rate.value.toFixed(4)} ${receiveCurrency.value}`;
});

function swapCurrencies() {
  const previousSend = sendCurrency.value;
  sendCurrency.value = receiveCurrency.value;
  receiveCurrency.value = previousSend;
}
</script>

<template>
  <section class="flex w-full max-w-275 flex-col gap-300 px-400 py-600 mx-auto">
    <h2 class="text-preset-2 uppercase text-neutral-50">Check the rates</h2>

    <div class="rounded-20 bg-neutral-700">
      <div
        class="grid grid-cols-1 items-center gap-300 p-300 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]"
      >
        <div
          class="flex min-w-0 flex-col gap-150 bg-neutral-600 p-250 rounded-16"
        >
          <p class="text-preset-5-medium uppercase text-neutral-200">Send</p>

          <div class="flex min-w-0 items-center gap-200">
            <AmountInput
              v-model="sendAmount"
              class="min-w-0 flex-1"
              name="send-amount"
            />
            <CurrencyPicker v-model="sendCurrency" />
          </div>
        </div>

        <Button
          variant="border"
          icon="local:icon-exchange"
          class="text-preset-2"
          aria-label="Swap send and receive currencies"
          @click="swapCurrencies"
        />

        <div
          class="flex min-w-0 flex-col gap-150 bg-neutral-600 p-250 rounded-16"
        >
          <p class="text-preset-5-medium uppercase text-neutral-200">Receive</p>

          <div class="flex min-w-0 items-center gap-200">
            <AmountInput
              v-model="receiveAmountModel"
              class="min-w-0 flex-1 text-lime-500"
              name="receive-amount"
              disabled
              aria-live="polite"
            />
            <CurrencyPicker v-model="receiveCurrency" />
          </div>
        </div>
      </div>

      <div class="border-t border-dashed border-neutral-500"></div>

      <div
        class="flex flex-col gap-200 px-300 py-250 sm:flex-row sm:items-center sm:justify-between"
      >
        <p class="text-preset-5 text-neutral-200" aria-live="polite">
          {{ rateLabel }}
        </p>

        <div class="flex flex-wrap gap-100">
          <Button variant="secondary" icon="local:icon-star-filled">
            FAVORITED
          </Button>
          <Button variant="outline">LOG CONVERSION</Button>
        </div>
      </div>
    </div>
  </section>
</template>
