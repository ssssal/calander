Vue.component('calendar', {
    data() {
        return {
            week: ['日', '一', '二', '三', '四', '五', '六'],
            current: '',
            startYear: '',
            startMonth: '',
            calendar: []
        }
    },
    props: {
        selected: {
            type: Array,
            default () {
                return []
            }
        },
        holiday: {
            type: Array,
            default () {
                return []
            }
        },
        leave: {
            type: Array,
            default () {
                return []
            }
        },
        end: {
            type: String,
            default () {
                return ''
            }
        },
        start: {
            type: String,
            default () {
                return ''
            }
        },
        color: {
            type: String,
            default: '#009ba4'
        },
        sign: false
    },
    created: function() {
        var year = Math.max(this.end.substr(0, 4), new Date().getFullYear())
        var month = this.end.substr(5, 2) - 1;
        var date = new Date();
        var day = date.getDate();
        //开始年份
        this.startYear = this.start.substr(0, 4);
        //开始月份 
        this.startMonth = new Date(Math.min(new Date(this.start.substr(0, 7)), new Date())).getMonth();
        //日历
        this.calendar = [...Array((year - this.startYear) * 12 + month - this.startMonth + 1).keys()].map(i => this.getDate(this.format(i)));
        //已选择的日期
        this.selected.forEach(i => {
            var time = i.split('-');
            this.calendar[time[1] - this.startMonth - 1 + (time[0] - this.startYear) * 12][time[2] - 1 + new Date(`${time[0]}-${time[1]}`).getDay()].selected = true;
        });
        //放假日期
        this.holiday.forEach(i => {
            var time = i.split('-')
            this.calendar[time[1] - this.startMonth - 1 + (time[0] - this.startYear) * 12][time[2] - 1 + new Date(`${time[0]}-${time[1]}`).getDay()].holiday = true;
        });
        //请假日期
        this.leave.forEach(i => {
            var time = i.split('-')
            this.calendar[time[1] - this.startMonth - 1 + (time[0] - this.startYear) * 12][time[2] - 1 + new Date(`${time[0]}-${time[1]}`).getDay()].leave = true;
        });
        //显示当月
        this.current = (new Date().getFullYear() - this.startYear) * 12 + new Date().getMonth() - this.startMonth;
        //显示当天特殊标记
        var currentMonth = this.calendar[this.current];
        currentMonth.forEach((e, index) => {
            if (e.date == day) {
                this.calendar[this.current][index].today = true;
            }
        });
    },
    methods: {
        getDate: function(e) {
            var time = e;
            time = time.replace(/月/g, '');
            time = time.split('年')
            return [...Array(new Date(`${time[0]}-${time[1]}`).getDay())].map(i => ({ date: '' })).concat([...Array([4, 6, 9, 11].includes(time[1] * 1) ? 30 : (time[1] != 2 ? 31 : (time[0] % 4 == 0 ? 29 : 28))).keys()].map(i => ({ date: i + 1 })))
        },
        format: function(e) {
            var time = new Date(new Date(this.startYear).setMonth(this.startMonth + e))
            return `${time.getFullYear()}年${(time.getMonth()<9 && '0')+(time.getMonth()+1)}月`
        },
        //跳转
        jump: function(e) {
            var type = e.currentTarget.dataset.type;
            var current = this.current;
            var calendar = this.calendar;
            if (type == 'prev') {
                this.current = current > 0 ? current -= 1 : 0;
            } else {
                this.current = (calendar.length - 1) > current ? current += 1 : (calendar.length - 1);
            }
            var year = this.format(this.current).substr(0, 4);
            var month = this.format(this.current).substr(5, 2);
            //传值给父组件
            this.$emit('date', {
                year: year,
                month: month
            });
        }
    },
    computed: {
        currentTime() {
            return this.format(this.current);
        }
    },
    template: `<div class="imt-calendar">
                <div class="calendar-month-wrapper">
                    <div class="calendar-icon calendar-icon-leftArrow" data-type="prev"  @click="jump" v-if="current > 0">
                        <img src="../static/icons/arrow_left.png" />
                    </div>
                    <div class="calendar-icon calendar-icon-leftArrow" v-else></div>
                    <div class="calendar-month">{{currentTime}}</div>
                    <div class="calendar-icon calendar-icon-rightArrow" data-type="next"  @click="jump" v-if="(calendar.length - 1) > current">
                        <img src="../static/icons/arrow_right.png" />
                    </div>
                    <div class="calendar-icon calendar-icon-rightArrow" v-else></div>
                </div>
                <div class="calendar-week-wrapper">
                    <div class="calendar-week" v-for="(item,key) in week" :key="key">{{item}}</div>
                </div>
                <div class="calendar-date-swiper"  >
                    <div class="calendar-date-wrapper" v-if="current == index" v-for="(item,index) in calendar" :key="index">
                        <div :class="['calendar-date',value.selected ? 'active': '',value.today ? 'today':'',value.holiday ? 'holiday' : '',
                    value.leave ? 'leave' : '']" v-for="(value,key) in item" :key="key">{{value.date}}</div>
                    </div>
                </div>
                <div class="calendar_status">
                    <div class="status_cell">
                        <i class="dotted blue"></i>
                        <p class="status_tips">已选择</p>
                    </div>
                    <div class="status_cell">
                        <i class="dotted orange"></i>
                        <p class="status_tips">已请假</p>
                    </div>
                </div>
            </div>`
});